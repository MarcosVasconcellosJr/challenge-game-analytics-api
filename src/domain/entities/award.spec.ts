import { Award } from '@/domain/entities/award'

describe('Award Entity', () => {
  it('should create an instance of Award with a random UUID if no id is provided', () => {
    const award = new Award('Best Player', 'player-123')

    expect(award).toBeInstanceOf(Award)
    expect(award.id).toBeDefined()
    expect(award.title).toBe('Best Player')
    expect(award.playerId).toBe('player-123')
  })

  it('should create an instance of Award with the provided id', () => {
    const award = new Award('Best Player', 'player-123', 'award-456')

    expect(award).toBeInstanceOf(Award)
    expect(award.id).toBe('award-456')
    expect(award.title).toBe('Best Player')
    expect(award.playerId).toBe('player-123')
  })

  it('should return the correct JSON representation of the Award', () => {
    const award = new Award('Best Player', 'player-123', 'award-456')

    const json = award.toJSON()

    expect(json).toEqual({
      id: 'award-456',
      title: 'Best Player',
      playerId: 'player-123',
    })
  })
})
