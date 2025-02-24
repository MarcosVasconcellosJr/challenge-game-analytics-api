import { Match } from '@/domain/entities/match'
import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { MatchesRepository } from '../repositories/matches-repository'
import { MatchEvent } from '../entities/match-event'
import { Weapon } from '../entities/weapon'
import { Player } from '../entities/player'
import { Team } from '../entities/team'
import { PlayersOnMatches } from '@/domain/entities/players-on-matches'

export interface CreateMatchUseCaseRequest extends Match {}

type CreateMatchUseCaseResponse = Either<
  null,
  {
    match: Match
  }
>

@Injectable()
export class CreateMatchUseCase {
  constructor(private matchesRepository: MatchesRepository) {}

  async execute(request: CreateMatchUseCaseRequest): Promise<CreateMatchUseCaseResponse> {
    const matchEvents = request.matchEvents?.map(
      (matchEvent) =>
        new MatchEvent(
          request.id,
          matchEvent.eventType,
          matchEvent.occurredAt,
          new Weapon(matchEvent.weapon.name),
          new Player(matchEvent.killerPlayer.name, new Team(matchEvent.killerPlayer.team.name)),
          new Player(matchEvent.victimPlayer.name, new Team(matchEvent.victimPlayer.team.name)),
          matchEvent.isWorldEvent,
          request.id
        )
    )

    const match = new Match(
      request.startedAt,
      request.endedAt,
      matchEvents,
      this.createPlayersOnMatches(request),
      request.id
    )

    match.setWinningPlayer()

    await this.matchesRepository.save(match)

    return right({
      match,
    })
  }

  private createPlayersOnMatches(match: Match): PlayersOnMatches[] {
    const playersOnMatches: PlayersOnMatches[] = []

    const allPlayers = [
      ...match.matchEvents.map((matchEvent) => matchEvent.killerPlayer),
      ...match.matchEvents.map((matchEvent) => matchEvent.victimPlayer),
    ]
    const uniquePlayers = this.deduplicatePlayers(allPlayers)

    for (const player of uniquePlayers.values()) {
      const playerOnMatch = new PlayersOnMatches(match, player)

      playerOnMatch.getPlayerMetrics()

      playersOnMatches.push(playerOnMatch)
    }

    return playersOnMatches
  }

  private deduplicatePlayers(allPlayers: Player[]) {
    const uniquePlayers = new Map<string, Player>()

    for (const player of allPlayers) {
      if (!uniquePlayers.has(player.name)) {
        uniquePlayers.set(player.name, player)
      }
    }

    return uniquePlayers
  }
}
