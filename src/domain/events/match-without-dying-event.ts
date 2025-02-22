import { DomainEvent } from '@/core/events/domain-event'
import { Player } from '../entities/player'
import { Match } from '../entities/match'

export class MatchWithoutDyingEvent implements DomainEvent {
  public occurredAt: Date
  public player: Player
  public match: Match

  constructor(player: Player, match: Match) {
    this.player = player
    this.match = match
    this.occurredAt = new Date()
  }

  getAggregateId(): string {
    return this.player.id
  }
}
