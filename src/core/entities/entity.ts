export abstract class Entity {
  readonly id: any

  abstract toJSON(): any

  public equals(entity: Entity) {
    if (entity === this) {
      return true
    }

    if (entity.id === this.id) {
      return true
    }

    return false
  }
}
