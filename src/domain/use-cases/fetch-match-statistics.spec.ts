import { InMemoryMatchesRepository } from 'test/repositories/in-memory-matchs-repository'
import { makeMatch } from 'test/factories/make-match'
import { randomUUID } from 'node:crypto'
import { FetchMatchStatisticsUseCase } from '@/domain/use-cases/fetch-match-statistics'

let inMemoryMatchesRepository: InMemoryMatchesRepository
let sut: FetchMatchStatisticsUseCase

describe('Fetch Match Statistics', () => {
  beforeEach(() => {
    inMemoryMatchesRepository = new InMemoryMatchesRepository()
    sut = new FetchMatchStatisticsUseCase(inMemoryMatchesRepository)
  })

  it('should be able to fetch match statistics', async () => {
    await inMemoryMatchesRepository.create(makeMatch('id-1'))
    await inMemoryMatchesRepository.create(makeMatch(randomUUID()))
    await inMemoryMatchesRepository.create(makeMatch(randomUUID()))

    const result = await sut.execute({
      matchId: 'id-1',
    })

    expect(inMemoryMatchesRepository.items[0]).toEqual(result.value)
    expect(inMemoryMatchesRepository.items[1]).not.toEqual(result.value)
  })
})
