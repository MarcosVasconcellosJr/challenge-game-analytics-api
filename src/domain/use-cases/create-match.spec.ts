import { CreateMatchUseCase } from '@/domain/use-cases/create-match'
import { InMemoryMatchesRepository } from 'test/repositories/in-memory-matchs-repository'
import { MatchEvent } from '../entities/match-event'
import { Weapon } from '../entities/weapon'
import { Player } from '../entities/player'
import { Team } from '../entities/team'
import { Match } from '@/domain/entities/match'
import { randomUUID } from 'node:crypto'

let inMemoryMatchesRepository: InMemoryMatchesRepository
let sut: CreateMatchUseCase

const createMatch = () => {
  return new Match(new Date(), new Date(), [
    new MatchEvent(
      randomUUID(),
      'kill',
      new Date(),
      new Weapon('AK47'),
      new Player('LUKE', new Team('Spartan')),
      new Player('GOLDEN', new Team('Grifnorhia')),
      false,
      randomUUID()
    ),
    new MatchEvent(
      randomUUID(),
      'kill',
      new Date(),
      new Weapon('M16'),
      new Player('KAGE', new Team('Spartan')),
      new Player('FLYN', new Team('Grifnorhia')),
      false,
      randomUUID()
    ),
  ])
}

describe('Create Match', () => {
  beforeEach(() => {
    inMemoryMatchesRepository = new InMemoryMatchesRepository()
    sut = new CreateMatchUseCase(inMemoryMatchesRepository)
  })

  it('should be able to create a match', async () => {
    const result = await sut.execute(createMatch())

    expect(result.isRight()).toBe(true)
    expect(inMemoryMatchesRepository.items[0]).toEqual(result.value?.match)
    expect(inMemoryMatchesRepository.items[0].matchEvents).toHaveLength(2)
  })

  it('should persist match events when creating a new match', async () => {
    const result = await sut.execute(createMatch())

    expect(result.isRight()).toBe(true)
    expect(inMemoryMatchesRepository.items[0]).toEqual(result.value?.match)
    expect(inMemoryMatchesRepository.items[0].matchEvents).toHaveLength(2)

    expect(inMemoryMatchesRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: result.value?.match.id,
        }),
      ])
    )
  })
})
