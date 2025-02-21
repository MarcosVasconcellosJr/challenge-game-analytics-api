import { randomUUID } from 'node:crypto'

export abstract class Entity<Props> {
  public id: string
  protected props: Props

  protected constructor(props: Props, id?: string) {
    this.props = props
    this.id = id ?? randomUUID()
  }

  public equals(entity: Entity<unknown>) {
    if (entity === this) {
      return true
    }

    if (entity.id === this.id) {
      return true
    }

    return false
  }
}
