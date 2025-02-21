import { DomainEvent } from '@/core/events/domain-event'
import { Player } from '../entities/player'

export class FiveKillsInOneMinuteEvent implements DomainEvent {
  public ocurredAt: Date
  public player: Player

  constructor(player: Player) {
    this.player = player
    this.ocurredAt = new Date()
  }

  getAggregateId(): string {
    return this.player.id
  }
}
