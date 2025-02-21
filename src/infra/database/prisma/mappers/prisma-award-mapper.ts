import { Award as PrismaAward, Prisma } from '@prisma/client'
import { Award } from '@/domain/entities/award'

export class PrismaAwardMapper {
  static toDomain(raw: PrismaAward): Award {
    return Award.create({
      title: raw.title,
      playerId: raw.playerId,
    })
  }

  static toPrisma(award: Award): Prisma.AwardUncheckedCreateInput {
    return {
      id: award.id,
      title: award.title,
      playerId: award.playerId?.toString(),
    }
  }
}
