import { Entity } from '@/core/entities/entity'

export interface TeamProps {
  name: string
}

export class Team extends Entity<TeamProps> {
  get name() {
    return this.props.name
  }

  static create(props: TeamProps) {
    const questionAttachment = new Team(props)

    return questionAttachment
  }
}
