import { GlobalStatisticsSearch, MatchesRepository } from '@/domain/repositories/matches-repository'
import { Match } from '@/domain/entities/match'
import { Injectable, Logger } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaMatchMapper } from '../mappers/prisma-match-mapper'
import { DomainEvents } from '@/core/events/domain-events'
import { Prisma } from '@prisma/client'
import { PrismaTeamMapper } from '@/infra/database/prisma/mappers/prisma-team-mapper'
import { Team } from '@/domain/entities/team'
import { PrismaPlayerMapper } from '@/infra/database/prisma/mappers/prisma-player-mapper'
import { Player } from '@/domain/entities/player'
import { Weapon } from '@/domain/entities/weapon'
import { PrismaWeaponMapper } from '@/infra/database/prisma/mappers/prisma-weapon-mapper'
import { PlayersOnMatches } from '@/domain/entities/players-on-matches'
import { PrismaPlayersOnMatchesMapper } from '@/infra/database/prisma/mappers/prisma-players-on-match-mapper'
import { GlobalStatisticsViewModel } from '@/application/http/view-model/global-statistics-view-model'

// TODO: Caching

@Injectable()
export class PrismaMatchesRepository implements MatchesRepository {
  private readonly logger = new Logger(PrismaMatchesRepository.name)

  constructor(private prisma: PrismaService) {}

  async create(match: Match): Promise<void> {
    const data = PrismaMatchMapper.toPrisma(match)

    await this.prisma.match.create({
      data,
    })

    DomainEvents.dispatchEventsForAggregate(match.id)
  }

  async findById(id: string): Promise<Match | null> {
    const match = await this.prisma.match.findUnique({
      where: { id },
      include: {
        playersOnMatches: {
          include: {
            player: true,
          },
        },
        matchEvents: {
          include: {
            weapon: true,
            killerPlayer: {
              include: {
                team: true,
              },
            },
            victimPlayer: {
              include: {
                team: true,
              },
            },
          },
        },
      },
    })

    if (!match) {
      return null
    }

    return PrismaMatchMapper.toDomain(match)
  }

  async findWithStatistics(id: string): Promise<Match | null> {
    const match = await this.prisma.match.findUnique({
      where: { id },
      include: {
        playersOnMatches: {
          include: {
            player: true,
            preferredWeapon: true,
          },
        },
      },
    })

    if (!match) {
      return null
    }

    return PrismaMatchMapper.toDomain(match)
  }

  async findGlobalStatistics(search: GlobalStatisticsSearch): Promise<GlobalStatisticsViewModel[]> {
    let ranking: GlobalStatisticsViewModel[]

    if (!search.realTime) {
      ranking = await this.prisma.$queryRaw<GlobalStatisticsViewModel[]>`
        SELECT * 
        FROM player_statistics
        WHERE 1=1
          ${search.playerName && `AND p."name" LIKE '%${search.playerName}%'`}
          ${search.playerId && `AND p."id" = '%${search.playerId}%'`}
        LIMIT ${search.limit}
        OFFSET ${search.offset}
      `
    } else {
      ranking = await this.prisma.$queryRaw<GlobalStatisticsViewModel[]>`
        SELECT
            p.id                                AS playerId,
            p.name                              AS playerName,
            SUM(pom."killVsDeathScore")::int    AS totalKillVsDeathScore,
            SUM(pom."fragScore")::int           AS totalFragScore,
            SUM(pom."deathCount")::int          AS totalDeathCount,
            SUM(pom."friendlyKillCount")::int   AS totalFriendlyKillCount,
            SUM(pom."killCount")::int           AS totalKillCount,
            SUM(pom."maxStreakCount")::int      AS totalMaxStreakCount,
            SUM(pom."totalKillCount")::int      AS totalTotalKillCount
        FROM
            "player" p
        JOIN "players-on-matchs" pom ON p.id = pom."playerId"
        WHERE 1=1
            --${search.playerName && `AND p."name" LIKE '%${search.playerName}%'`}
            --${search.playerId && `AND p."id" = '%${search.playerId}%'`}
        GROUP BY
            p.id, p.name
        ORDER BY
            totalKillVsDeathScore desc,
            totalFragScore DESC
        LIMIT ${search.limit}
        OFFSET ${search.offset}
      `
    }

    return ranking
  }

  async save(match: Match): Promise<void> {
    const matchData = PrismaMatchMapper.toPrisma(match)

    const teamsCreatedList = await this.saveTeams(match)

    const [playersCreatedList, weaponsCreatedList] = await Promise.all([
      this.savePlayers(match, teamsCreatedList),
      this.saveWeapons(match),
    ])

    const playersMap = new Map(playersCreatedList.map((player) => [player.name, player.id]))
    const weaponsMap = new Map(weaponsCreatedList.map((weapon) => [weapon.name, weapon.id]))

    this.mapPlayersOnMatchFK(match, playersCreatedList)

    await this.prisma.$transaction(
      async (tx) => {
        if (match.winningPlayer) {
          matchData.winningPlayerId = playersCreatedList.find((player) => player.name === match.winningPlayer?.name)?.id
        }

        const matchCreated = await tx.match.upsert({
          where: { id: matchData.id },
          update: matchData,
          create: matchData,
        })

        await this.saveMatchEvents(tx, match, matchCreated.id, playersMap, weaponsMap)

        await this.savePlayersOnMatches(tx, match, matchCreated.id, playersMap, weaponsMap)
      },
      {
        maxWait: 50_000,
        timeout: 100_000,
      }
    )

    DomainEvents.dispatchEventsForAggregate(match.id)
  }

  private mapPlayersOnMatchFK(match: Match, playersCreatedList: Player[]) {
    match.playersOnMatches = match.playersOnMatches.map((playerOnMatch) => {
      const player = playersCreatedList.find((player) => player.name === playerOnMatch.player.name)

      if (player) {
        playerOnMatch.player.id = player.id
      }

      return playerOnMatch
    })
  }

  private async saveWeapons(match: Match): Promise<Weapon[]> {
    let response: Weapon[]

    try {
      const weaponsToCreate: Prisma.WeaponUncheckedCreateInput[] = []

      match.matchEvents.forEach((event) => {
        if (!weaponsToCreate.find((weapon) => weapon.name === event.weapon.name)) {
          weaponsToCreate.push(PrismaWeaponMapper.toPrisma(event.weapon))
        }
      })

      const weaponsCreatedList = await Promise.all(
        weaponsToCreate.map((weapon) =>
          this.prisma.weapon.upsert({
            where: { name: weapon.name },
            update: weapon,
            create: weapon,
          })
        )
      )

      response = weaponsCreatedList.map((weapon) => PrismaWeaponMapper.toDomain(weapon))
    } catch (err) {
      this.logger.error('[saveWeapons] Error persisting weapon list', err)
      throw err
    }

    return response
  }

  private async savePlayers(match: Match, teams: Team[]): Promise<Player[]> {
    let response: Player[]

    try {
      const playerCreateList: Prisma.PlayerUncheckedCreateInput[] = []

      match.playersOnMatches.forEach((playerOnMatches) => {
        if (!playerCreateList.find((player) => player.name === playerOnMatches.player.team.name)) {
          playerOnMatches.player.teamId = teams.find((team) => team.name === playerOnMatches.player.team.name)?.id
          playerCreateList.push(PrismaPlayerMapper.toPrisma(playerOnMatches.player))
        }
      })

      const playersCreatedList = await Promise.all(
        playerCreateList.map((playerData) =>
          this.prisma.player.upsert({
            where: { name: playerData.name },
            update: playerData,
            create: playerData,
          })
        )
      )

      response = playersCreatedList.map((player) =>
        PrismaPlayerMapper.toDomain({
          ...player,
          team: teams.find((team) => team.id === player.teamId) as Team,
        })
      )
    } catch (err) {
      this.logger.error('[savePlayers] Error persisting player list', err)
      throw err
    }

    return response
  }

  private async saveTeams(match: Match): Promise<Team[]> {
    let response: Team[]

    try {
      const teamsCreateList: Prisma.TeamUncheckedCreateInput[] = []

      match.playersOnMatches.forEach((playerOnMatches) => {
        if (!teamsCreateList.find((team) => team.name === playerOnMatches.player.team.name)) {
          teamsCreateList.push(PrismaTeamMapper.toPrisma(playerOnMatches.player.team))
        }
      })

      const teamsCreatedList = await Promise.all(
        teamsCreateList.map((teamData) =>
          this.prisma.team.upsert({
            where: { name: teamData.name },
            update: teamData,
            create: teamData,
          })
        )
      )

      response = teamsCreatedList.map((team) => PrismaTeamMapper.toDomain(team))
    } catch (err) {
      this.logger.error('[saveTeams] Error persisting team list', err)
      throw err
    }

    return response
  }

  private async savePlayersOnMatches(
    tx: Prisma.TransactionClient,
    match: Match,
    matchId: string,
    playersMap: Map<string, string>,
    weaponsMap: Map<string, string>
  ) {
    const playersOnMatchesList = match.playersOnMatches.map((playerOnMatch) => {
      const playerId = playersMap.get(playerOnMatch.player.name)

      return {
        ...playerOnMatch,
        player: { ...playerOnMatch.player, id: playerId },
        playerId,
      } as PlayersOnMatches
    })

    const data = playersOnMatchesList.map((playerOnMatch) => PrismaPlayersOnMatchesMapper.toPrisma(playerOnMatch))

    await Promise.all(
      data.map((playersOnMatchData) => {
        const playerOnMatch = playersOnMatchesList.find(
          (playerOnMatch) => playerOnMatch.playerId === playersOnMatchData.playerId
        )

        let preferredWeaponId
        if (playerOnMatch && playerOnMatch.preferredWeapon) {
          preferredWeaponId = weaponsMap.get(playerOnMatch.preferredWeapon.name)
        }

        const upsertPayload: Prisma.PlayersOnMatchsUncheckedCreateInput = {
          ...playersOnMatchData,
          matchId,
          preferredWeaponId,
        }

        return tx.playersOnMatchs.upsert({
          where: { matchId_playerId: { matchId, playerId: playersOnMatchData.playerId } },
          create: upsertPayload,
          update: upsertPayload,
        })
      })
    )

    match.playersOnMatches.forEach((agg) => {
      DomainEvents.dispatchEventsForAggregate(agg.id)
    })
  }

  async delete(question: Match): Promise<void> {
    const data = PrismaMatchMapper.toPrisma(question)

    await this.prisma.match.delete({
      where: {
        id: data.id,
      },
    })
  }

  private async saveMatchEvents(
    tx: Prisma.TransactionClient,
    match: Match,
    matchId: string,
    playersMap: Map<string, string>,
    weaponsMap: Map<string, string>
  ) {
    try {
      await tx.matchEvent.deleteMany({ where: { matchId } })

      const createMany = match.matchEvents.map((event) => {
        const matchEventData: Prisma.MatchEventCreateManyInput = {
          matchId,
          eventType: event.eventType,
          occurredAt: event.occurredAt,
          weaponId: weaponsMap.get(event.weapon.name) as string,
          killerId: playersMap.get(event.killerPlayer.name) as string,
          victimId: playersMap.get(event.victimPlayer.name) as string,
          isWorldEvent: event.isWorldEvent,
          isFriendlyFire: event.isFriendlyFire,
        }

        return matchEventData
      })

      await tx.matchEvent.createMany({ data: createMany })
    } catch (err) {
      this.logger.error('[saveMatchEvents] Error persisting match event list', err)
      throw err
    }
  }
}
