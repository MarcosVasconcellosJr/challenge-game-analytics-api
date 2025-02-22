import { Entity } from '@/core/entities/entity'

export class Weapon extends Entity {
  public id: string
  public name: string

  constructor(name: string, id?: string) {
    super()
    this.id = id ?? crypto.randomUUID()
    this.name = name
  }

  static create(props: any) {
    return new Weapon(props)
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
    }
  }
}
