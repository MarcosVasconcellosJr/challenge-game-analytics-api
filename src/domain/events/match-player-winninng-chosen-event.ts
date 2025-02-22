import { DomainEvent } from '@/core/events/domain-event'
import { Match } from '../entities/match'

export class MatchPlayerWinnningChosenEvent implements DomainEvent {
  public ocurredAt: Date
  public match: Match
  public winningPlayerId: string

  constructor(match: Match, winningPlayerId: string) {
    this.match = match
    this.winningPlayerId = winningPlayerId
    this.ocurredAt = new Date()
  }

  getAggregateId(): string {
    return this.match.id
  }
}
