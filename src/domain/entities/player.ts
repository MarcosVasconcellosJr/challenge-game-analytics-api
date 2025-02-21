import { Entity } from '@/core/entities/entity'
import { Team } from './team'

export interface PlayerProps {
  name: string
  team: Team
  teamId?: string | null
}

export class Player extends Entity<PlayerProps> {
  get name() {
    return this.props.name
  }

  get team() {
    return this.props.team
  }

  get teamId(): string | null | undefined {
    return this.props.teamId
  }

  set teamId(teamId: string | null | undefined) {
    this.props.teamId = teamId
  }

  static create(props: PlayerProps) {
    const questionAttachment = new Player(props)

    return questionAttachment
  }
}
