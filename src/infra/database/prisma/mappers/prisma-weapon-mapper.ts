import { Weapon as PrismaWeapon, Prisma } from '@prisma/client'
import { Weapon } from '@/domain/entities/weapon'

export class PrismaWeaponMapper {
  static toDomain(raw: PrismaWeapon): Weapon {
    return new Weapon(raw.name, raw.id)
  }

  static toPrisma(weapon: Weapon): Prisma.WeaponUncheckedCreateInput {
    return {
      name: weapon.name,
    }
  }
}
