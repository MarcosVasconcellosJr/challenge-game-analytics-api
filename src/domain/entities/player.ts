import { Entity } from '@/core/entities/entity'
import { Team } from './team'

export class Player extends Entity {
  public id: string
  public name: string
  public teamId?: string
  public team: Team

  constructor(name: string, team: Team, teamId?: string, id?: string) {
    super()
    this.id = id ?? crypto.randomUUID()
    this.name = name
    this.team = team
    this.teamId = team?.id ?? teamId
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      team: this.team?.toJSON(),
    }
  }
}
