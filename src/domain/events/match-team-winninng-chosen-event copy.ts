import { DomainEvent } from '@/core/events/domain-event'
import { Match } from '../entities/match'

export class MatchTeamWinnningChosenEvent implements DomainEvent {
  public ocurredAt: Date
  public match: Match
  public winningTeamId: string

  constructor(match: Match, winningTeamId: string) {
    this.match = match
    this.winningTeamId = winningTeamId
    this.ocurredAt = new Date()
  }

  getAggregateId(): string {
    return this.match.id
  }
}
