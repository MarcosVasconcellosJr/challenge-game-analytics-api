import { Match } from '@/domain/entities/match'
import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { MatchsRepository } from '../repositories/matchs-repository'
import { MatchEvent } from '../entities/match-event'

interface CreateMatchUseCaseRequest {
  id?: string
  startedAt: Date
  endedAt: Date | null
  events: MatchEvent[]
  updatedAt?: Date | null
}

type CreateMatchUseCaseResponse = Either<
  null,
  {
    match: Match
  }
>

@Injectable()
export class CreateMatchUseCase {
  constructor(private matchsRepository: MatchsRepository) {}

  async execute(
    request: CreateMatchUseCaseRequest,
  ): Promise<CreateMatchUseCaseResponse> {
    const match = Match.create(request)

    await this.matchsRepository.save(match)

    return right({
      match,
    })
  }
}
