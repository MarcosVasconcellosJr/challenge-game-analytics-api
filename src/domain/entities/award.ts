import { AggregateRoot } from '@/core/entities/aggregate-root'

export class Award extends AggregateRoot {
  public id: string
  public title: string
  public playerId: string

  constructor(title: string, playerId: string, id?: string) {
    super()
    this.id = id ?? crypto.randomUUID()
    this.title = title
    this.playerId = playerId
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      playerId: this.playerId,
    }
  }
}
