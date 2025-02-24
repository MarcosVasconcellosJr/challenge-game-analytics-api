import { DomainEvent } from '@/core/events/domain-event'
import { Match } from '../entities/match'

export class MatchCreatedEvent implements DomainEvent {
  public occurredAt: Date
  public match: Match

  constructor(match: Match) {
    this.match = match
    this.occurredAt = new Date()
  }

  getAggregateId(): string {
    return this.match.id
  }
}
