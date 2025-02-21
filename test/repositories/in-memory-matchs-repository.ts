import { DomainEvents } from '@/core/events/domain-events'
import { MatchsRepository } from '@/domain/repositories/matchs-repository'
import { Match } from '@/domain/entities/match'

export class InMemoryMatchsRepository implements MatchsRepository {
  public items: Match[] = []

  constructor() {}

  async findById(id: string) {
    const question = this.items.find((item) => item.id.toString() === id)

    if (!question) {
      return null
    }

    return question
  }

  async save(match: Match) {
    this.items.push(match)

    // TODO: Save aggregates

    DomainEvents.dispatchEventsForAggregate(match.id)
  }

  async delete(question: Match) {
    const itemIndex = this.items.findIndex((item) => item.id === question.id)

    this.items.splice(itemIndex, 1)
  }
}
