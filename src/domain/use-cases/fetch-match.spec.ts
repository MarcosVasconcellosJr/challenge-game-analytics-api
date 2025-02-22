import { InMemoryMatchesRepository } from 'test/repositories/in-memory-matchs-repository'
import { FetchMatchUseCase } from '@/domain/use-cases/fetch-match'
import { makeMatch } from 'test/factories/make-match'
import { randomUUID } from 'node:crypto'

let inMemoryMatchesRepository: InMemoryMatchesRepository
let sut: FetchMatchUseCase

describe('Fetch Match', () => {
  beforeEach(() => {
    inMemoryMatchesRepository = new InMemoryMatchesRepository()
    sut = new FetchMatchUseCase(inMemoryMatchesRepository)
  })

  it('should be able to fetch match', async () => {
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
