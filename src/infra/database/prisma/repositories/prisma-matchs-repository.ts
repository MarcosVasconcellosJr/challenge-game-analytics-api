import { MatchesRepository } from '@/domain/repositories/matches-repository'
import { Match } from '@/domain/entities/match'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaMatchMapper } from '../mappers/prisma-match-mapper'
import { DomainEvents } from '@/core/events/domain-events'
import { MatchEvent } from '@/domain/entities/match-event'
import { PlayersOnMatches } from '@/domain/entities/players-on-matches'
import { PrismaPlayersOnMatchesMapper } from '@/infra/database/prisma/mappers/prisma-players-on-match-mapper'
import { Prisma } from '@prisma/client'

// TODO: Caching

@Injectable()
export class PrismaMatchesRepository implements MatchesRepository {
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

  async save(match: Match): Promise<void> {
    const data = PrismaMatchMapper.toPrisma(match)

    await this.prisma.$transaction(async (tx) => {
      await tx.match.upsert({
        where: { id: data.id },
        update: data,
        create: data,
      })

      await Promise.all(match.matchEvents.map((matchEvent) => this.saveMatchEvents(tx, matchEvent)))

      await this.savePlayersOnMatches(tx, match.playersOnMatches)
    })

    DomainEvents.dispatchEventsForAggregate(match.id)
  }

  private async saveMatchEvents(tx: Prisma.TransactionClient, matchEvent: MatchEvent) {
    const [weapon, killerTeam, victimTeam] = await Promise.all([
      tx.weapon.upsert({
        where: { name: matchEvent.weapon.name },
        update: { name: matchEvent.weapon.name },
        create: { name: matchEvent.weapon.name },
      }),

      tx.team.upsert({
        where: { name: matchEvent.killerPlayer.team.name },
        update: { name: matchEvent.killerPlayer.team.name },
        create: { name: matchEvent.killerPlayer.team.name },
      }),

      tx.team.upsert({
        where: { name: matchEvent.victimPlayer.team.name },
        update: { name: matchEvent.victimPlayer.team.name },
        create: { name: matchEvent.victimPlayer.team.name },
      }),
    ])

    const [killer, victim] = await Promise.all([
      tx.player.upsert({
        where: { name: matchEvent.killerPlayer.name },
        update: { name: matchEvent.killerPlayer.name, teamId: killerTeam.id },
        create: { name: matchEvent.killerPlayer.name, teamId: killerTeam.id },
      }),

      tx.player.upsert({
        where: { name: matchEvent.victimPlayer.name },
        update: { name: matchEvent.victimPlayer.name, teamId: victimTeam.id },
        create: { name: matchEvent.victimPlayer.name, teamId: victimTeam.id },
      }),
    ])

    const matchEventData = {
      matchId: matchEvent.matchId,
      eventType: matchEvent.eventType,
      occurredAt: matchEvent.occurredAt,
      weaponId: weapon.id,
      killerId: killer.id,
      victimId: victim.id,
      isWorldEvent: matchEvent.isWorldEvent,
      isFriendlyFire: matchEvent.isFriendlyFire,
    }

    await tx.matchEvent.upsert({
      where: { id: matchEvent.id },
      update: matchEventData,
      create: matchEventData,
    })
  }

  private async savePlayersOnMatches(tx: Prisma.TransactionClient, playersOnMatches: PlayersOnMatches[]) {
    const data = playersOnMatches.map((playerOnMatch) => PrismaPlayersOnMatchesMapper.toPrisma(playerOnMatch))

    await tx.playersOnMatchs.createMany({
      data,
    })

    playersOnMatches.forEach((agg) => {
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
}
