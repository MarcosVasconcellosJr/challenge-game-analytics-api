import { Either, right } from '@/core/either'
import { MatchesRepository } from '../repositories/matches-repository'
import { Injectable } from '@nestjs/common'
import { Match } from '../entities/match'

interface FetchMatchStatisticsUseCaseRequest {
  matchId: string
}

type FetchMatchStatisticsUseCaseResponse = Either<null, Match | null>

@Injectable()
export class FetchMatchStatisticsUseCase {
  constructor(private matchesRepository: MatchesRepository) {}

  async execute(request: FetchMatchStatisticsUseCaseRequest): Promise<FetchMatchStatisticsUseCaseResponse> {
    const match = await this.matchesRepository.findWithStatistics(request.matchId)

    return right(match)
  }
}
