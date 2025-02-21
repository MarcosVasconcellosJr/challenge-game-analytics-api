import { CreateMatchUseCase } from '@/domain/use-cases/create-match'
import { InMemoryMatchsRepository } from 'test/repositories/in-memory-matchs-repository'
import { MatchEvent } from '../entities/match-event'
import { Weapon } from '../entities/weapon'
import { Player } from '../entities/player'
import { Team } from '../entities/team'

let inMemoryMatchsRepository: InMemoryMatchsRepository
let sut: CreateMatchUseCase

const createMatch = () => {
  return {
    startedAt: new Date(),
    endedAt: new Date(),
    events: [
      MatchEvent.create({
        ocurredAt: new Date(),
        eventType: 'kill',
        weapon: Weapon.create({ name: 'AK47' }),
        killer: Player.create({
          name: 'JHON',
          team: Team.create({ name: 'TEAM 1' }),
        }),
        victim: Player.create({
          name: 'MONO',
          team: Team.create({ name: 'TEAM 2' }),
        }),
        isWorldEvent: false,
      }),
      MatchEvent.create({
        ocurredAt: new Date(),
        eventType: 'kill',
        weapon: Weapon.create({ name: 'M16' }),
        killer: Player.create({
          name: 'GAB',
          team: Team.create({ name: 'TEAM 1' }),
        }),
        victim: Player.create({
          name: 'MOLIN',
          team: Team.create({ name: 'TEAM 2' }),
        }),
        isWorldEvent: false,
      }),
    ],
  }
}

describe('Create Match', () => {
  beforeEach(() => {
    inMemoryMatchsRepository = new InMemoryMatchsRepository()
    sut = new CreateMatchUseCase(inMemoryMatchsRepository)
  })

  it('should be able to create a match', async () => {
    const result = await sut.execute(createMatch())

    expect(result.isRight()).toBe(true)
    expect(inMemoryMatchsRepository.items[0]).toEqual(result.value?.match)
    expect(inMemoryMatchsRepository.items[0].events).toHaveLength(2)
  })

  it('should persist match events when creating a new match', async () => {
    const result = await sut.execute(createMatch())

    expect(result.isRight()).toBe(true)
    expect(inMemoryMatchsRepository.items[0]).toEqual(result.value?.match)
    expect(inMemoryMatchsRepository.items[0].events).toHaveLength(2)

    expect(inMemoryMatchsRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: result.value?.match.id,
        }),
      ]),
    )
  })
})
