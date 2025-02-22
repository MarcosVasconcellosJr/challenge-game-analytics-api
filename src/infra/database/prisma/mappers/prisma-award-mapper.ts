import { Award as PrismaAward, Prisma } from '@prisma/client'
import { Award } from '@/domain/entities/award'

export class PrismaAwardMapper {
  static toDomain(raw: PrismaAward): Award {
    return new Award(raw.title, raw.playerId)
  }

  static toPrisma(award: Award): Prisma.AwardUncheckedCreateInput {
    return {
      id: award.id,
      title: award.title,
      playerId: award.playerId?.toString(),
    }
  }
}
