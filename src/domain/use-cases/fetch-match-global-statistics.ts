import { Either, right } from '@/core/either'
import { MatchesRepository } from '../repositories/matches-repository'
import { Injectable } from '@nestjs/common'
import { Match } from '../entities/match'

interface FetchMatchGlobalStatisticsUseCaseRequest {
  playerName?: string
  playerId?: string
  limit: number
  offset: number
  realTime: boolean
}

type FetchMatchGlobalStatisticsUseCaseResponse = Either<null, Match | null>

@Injectable()
export class FetchMatchGlobalStatisticsUseCase {
  constructor(private matchesRepository: MatchesRepository) {}

  async execute({
    playerName,
    playerId,
    offset = 1,
    limit = 20,
    realTime = true,
  }: FetchMatchGlobalStatisticsUseCaseRequest): Promise<FetchMatchGlobalStatisticsUseCaseResponse> {
    const match = await this.matchesRepository.findGlobalStatistics({
      playerName,
      playerId,
      offset,
      limit,
      realTime,
    })

    return right(match)
  }
}
