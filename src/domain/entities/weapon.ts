import { Entity } from '@/core/entities/entity'

export interface WeaponProps {
  name: string
}

export class Weapon extends Entity<WeaponProps> {
  get name() {
    return this.props.name
  }

  static create(props: WeaponProps) {
    const questionAttachment = new Weapon(props)

    return questionAttachment
  }
}
