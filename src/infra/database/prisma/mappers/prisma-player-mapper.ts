import { Player as PrismaPlayer, Prisma } from '@prisma/client'
import { Player } from '@/domain/entities/player'
import { Team } from '@/domain/entities/team'

export class PrismaPlayerMapper {
  static toDomain(raw: PrismaPlayer & { team: Team }): Player {
    return new Player(raw.name, raw.team, undefined, raw.id)
  }

  static toPrisma(prisma: Player): Prisma.PlayerUncheckedCreateInput {
    return {
      name: prisma.name,
      teamId: prisma.teamId,
    } as Prisma.PlayerUncheckedCreateInput
  }
}
