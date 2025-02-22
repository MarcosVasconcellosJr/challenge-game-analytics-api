import { DomainEvent } from '@/core/events/domain-event'
import { Match } from '../entities/match'

export class MatchCreatedEvent implements DomainEvent {
  public ocurredAt: Date
  public match: Match

  constructor(match: Match) {
    this.match = match
    this.ocurredAt = new Date()
  }

  getAggregateId(): string {
    return this.match.id
  }
}
