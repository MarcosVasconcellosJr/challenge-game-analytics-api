import { Entity } from '@/core/entities/entity'
import { Team } from './team'

export class Player extends Entity {
  public id: string
  public name: string
  public team: Team
  public teamId?: string

  constructor(name: string, team: Team, id?: string) {
    super()
    this.id = id ?? crypto.randomUUID()
    this.name = name
    this.team = team
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      team: this.team,
      teamId: this.teamId,
    }
  }
}
