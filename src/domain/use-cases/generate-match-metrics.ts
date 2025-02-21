import { Match } from '@/domain/entities/match'
import { Injectable } from '@nestjs/common'
import { PlayersOnMatchs } from '../entities/players-on-matchs'
import { MatchEvent } from '../entities/match-event'
import { PlayersOnMatchsRepository } from '../repositories/players-on-matchs-repository'

export interface GenerateMatchMetricsUseCaseRequest extends Match {
  startedAt: Date
  endedAt: Date
  events: MatchEvent[]
}

@Injectable()
export class GenerateMatchMetricsUseCase {
  constructor(private playersOnMatchsRepository: PlayersOnMatchsRepository) {}

  async execute(match: GenerateMatchMetricsUseCaseRequest): Promise<void> {
    const playersOnMatchs: PlayersOnMatchs[] = []

    const players = [
      ...match.events.map((event) => event.killer),
      ...match.events.map((event) => event.victim),
    ]

    for (const player of players) {
      const playerOnMatch = PlayersOnMatchs.create({ player, match })

      playerOnMatch.getPlayerMetrics()

      playersOnMatchs.push(playerOnMatch)
    }

    await this.playersOnMatchsRepository.save(playersOnMatchs)
  }
}
