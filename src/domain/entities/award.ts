import { Player } from './player'
import { AggregateRoot } from '@/core/entities/aggregate-root'

export interface AwardProps {
  player?: Player
  playerId: string
  title: string
}

export class Award extends AggregateRoot<AwardProps> {
  get title() {
    return this.props.title
  }

  set title(title: string) {
    this.props.title = title
  }

  get playerId() {
    return this.props.playerId
  }

  get player(): Player | null | undefined {
    return this.props.player
  }

  set player(player: Player) {
    this.props.player = player
  }

  static create(props: AwardProps) {
    const award = new Award({
      ...props,
    })

    return award
  }
}
