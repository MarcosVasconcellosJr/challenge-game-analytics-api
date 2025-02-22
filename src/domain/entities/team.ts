import { Entity } from '@/core/entities/entity'

export class Team extends Entity {
  public id: string
  public name: string

  constructor(name: string, id?: string) {
    super()
    this.id = id ?? crypto.randomUUID()
    this.name = name
  }

  static create(props: any) {
    return new Team(props)
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
    }
  }
}
