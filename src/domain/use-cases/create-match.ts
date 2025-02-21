import { Match } from '@/domain/entities/match'
import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { MatchsRepository } from '../repositories/matchs-repository'
import { MatchEvent } from '../entities/match-event'
import { Weapon } from '../entities/weapon'
import { Player } from '../entities/player'
import { Team } from '../entities/team'

interface WeaponDto {
  name: string
}

interface TeamDto {
  name: string
}

interface PlayerDto {
  name: string
  team: TeamDto
}

interface MatchEventDto {
  eventType: string
  matchId: string | undefined
  ocurredAt: Date
  weapon: WeaponDto
  killer: PlayerDto
  victim: PlayerDto
  isWorldEvent: boolean
  isFriendlyFire: boolean
}

export interface CreateMatchUseCaseRequest {
  id: string
  startedAt: Date
  endedAt?: Date | null
  events?: MatchEventDto[] | null
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
    const match = Match.create({
      startedAt: request.startedAt,
      endedAt: request.endedAt,
      events: request.events?.map((event) =>
        MatchEvent.create({
          ocurredAt: event.ocurredAt,
          eventType: event.eventType,
          isWorldEvent: event.isWorldEvent,
          weapon: Weapon.create({
            name: event.weapon.name,
          }),
          killer: Player.create({
            name: event.killer.name,
            team: Team.create({
              name: event.killer.team.name,
            }),
          }),
          victim: Player.create({
            name: event.victim.name,
            team: Team.create({
              name: event.victim.team.name,
            }),
          }),
        }),
      ),
    })

    await this.matchsRepository.save(match)

    return right({
      match,
    })
  }
}
