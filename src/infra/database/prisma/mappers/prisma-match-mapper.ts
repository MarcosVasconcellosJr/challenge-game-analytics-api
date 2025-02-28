import { Match } from '@/domain/entities/match'
import { MatchEvent } from '@/domain/entities/match-event'
import { Weapon } from '@/domain/entities/weapon'
import { Player } from '@/domain/entities/player'
import { Team } from '@/domain/entities/team'
import { Prisma } from '@prisma/client'
import { PlayersOnMatches } from '@/domain/entities/players-on-matches'

export class PrismaMatchMapper {
  static toDomain(raw: any): Match {
    const matchEvents = raw.matchEvents?.map(
      (matchEvent) =>
        new MatchEvent(
          raw.id,
          matchEvent.eventType,
          matchEvent.occurredAt,
          new Weapon(matchEvent.weapon.name, matchEvent.weapon.id),
          new Player(
            matchEvent.killerPlayer.name,
            new Team(matchEvent.killerPlayer.team.name, matchEvent.killerPlayer.team.id),
            matchEvent.killerPlayer.team.id,
            matchEvent.killerPlayer.id
          ),
          new Player(
            matchEvent.victimPlayer.name,
            new Team(matchEvent.victimPlayer.team.name, matchEvent.victimPlayer.team.id),
            matchEvent.victimPlayer.team.id,
            matchEvent.victimPlayer.id
          ),
          matchEvent.isWorldEvent,
          raw.id,
          raw.createdAt
        )
    )

    const match = new Match(raw.startedAt, raw.endedAt, matchEvents, null, raw.id)

    match.playersOnMatches = raw.playersOnMatches?.map(
      (playersOnMatch) =>
        new PlayersOnMatches(
          match,
          new Player(
            playersOnMatch.player.name,
            new Team(playersOnMatch.player.team.name, playersOnMatch.player.team.id),
            playersOnMatch.player.team.id,
            playersOnMatch.player.id
          ),
          playersOnMatch.killCount,
          playersOnMatch.friendlyKillCount,
          playersOnMatch.totalKillCount,
          playersOnMatch.deathCount,
          playersOnMatch.maxStreakCount
        )
    )

    return match
  }

  static toPrisma(match: Match): Prisma.MatchUncheckedCreateInput {
    return {
      id: match.id,
      winningTeamId: match.winningTeamId,
      winningPlayerId: match.winningPlayerId,
      startedAt: match.startedAt,
      endedAt: match.endedAt ?? new Date(),
      createdAt: match.createdAt,
      updatedAt: match.updatedAt,
    }
  }
}
