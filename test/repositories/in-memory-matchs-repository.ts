import { DomainEvents } from '@/core/events/domain-events'
import { MatchesRepository } from '@/domain/repositories/matches-repository'
import { Match } from '@/domain/entities/match'

export class InMemoryMatchesRepository implements MatchesRepository {
  public items: Match[] = []

  constructor() {}

  async findById(id: string) {
    const match = this.items.find((item) => item.id.toString() === id)

    if (!match) {
      return null
    }

    return match
  }

  async findWithStatistics(id: string): Promise<Match | null> {
    const question = this.items.find((item) => item.id.toString() === id)

    if (!question) {
      return null
    }

    return question
  }

  async create(match: Match): Promise<void> {
    this.items.push(match)

    DomainEvents.dispatchEventsForAggregate(match.id)
  }

  async save(match: Match) {
    this.items.push(match)

    DomainEvents.dispatchEventsForAggregate(match.id)
  }

  async delete(question: Match) {
    const itemIndex = this.items.findIndex((item) => item.id === question.id)

    this.items.splice(itemIndex, 1)
  }
}
