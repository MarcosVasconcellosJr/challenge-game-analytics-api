import { Either, right } from '@/core/either'
import { MatchesRepository } from '../repositories/matches-repository'
import { Injectable } from '@nestjs/common'
import { Match } from '../entities/match'

interface FetchMatchUseCaseRequest {
  matchId: string
}

type FetchMatchUseCaseResponse = Either<null, Match | null>

@Injectable()
export class FetchMatchUseCase {
  constructor(private matchesRepository: MatchesRepository) {}

  async execute(request: FetchMatchUseCaseRequest): Promise<FetchMatchUseCaseResponse> {
    const match = await this.matchesRepository.findById(request.matchId)

    return right(match)
  }
}
