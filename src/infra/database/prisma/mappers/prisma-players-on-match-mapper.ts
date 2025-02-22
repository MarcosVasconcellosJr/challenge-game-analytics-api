import { Prisma } from '@prisma/client'
import { PlayersOnMatches } from '@/domain/entities/players-on-matches'

export class PrismaPlayersOnMatchesMapper {
  static toPrisma(entity: PlayersOnMatches): Prisma.PlayersOnMatchsUncheckedCreateInput {
    return {
      matchId: entity.match?.id ?? entity.matchId,
      playerId: entity.player?.id ?? entity.playerId,
      preferredWeaponId: entity.preferredWeapon?.id ?? entity.preferredWeaponId,
      killCount: entity.killCount ?? 0,
      friendlyKillCount: entity.friendlyKillCount ?? 0,
      totalKillCount: entity.totalKillCount ?? 0,
      deathCount: entity.deathCount ?? 0,
      maxStreakCount: entity.maxStreakCount ?? 0,
    }
  }
}
