import { Match as PrismaMatch, Prisma } from '@prisma/client'
import { Match } from '@/domain/entities/match'

export class PrismaMatchMapper {
  static toDomain(raw: PrismaMatch): Match {
    return Match.create({
      startedAt: raw.startedAt,
      endedAt: raw.endedAt,
      winningTeamId: raw.winningTeamId,
      winningPlayerId: raw.winningPlayerId,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    })
  }

  static toPrisma(match: Match): Prisma.MatchUncheckedCreateInput {
    return {
      id: match.id?.toString(),
      winningTeamId: match.winningTeamId?.toString(),
      winningPlayerId: match.winningPlayerId?.toString(),
      startedAt: match.startedAt,
      endedAt: match.endedAt,
      createdAt: match.createdAt,
      updatedAt: match.updatedAt,
    }
  }
}
