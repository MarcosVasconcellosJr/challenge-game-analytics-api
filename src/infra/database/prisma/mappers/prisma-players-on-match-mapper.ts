import { Prisma } from '@prisma/client'
import { PlayersOnMatches } from '@/domain/entities/players-on-matches'

export class PrismaPlayersOnMatchesMapper {
  static toPrisma(entity: PlayersOnMatches): Prisma.PlayersOnMatchsUncheckedCreateInput {
    return {
      matchId: entity.matchId ?? entity.match?.id,
      playerId: entity.playerId ?? entity.player?.id,
      preferredWeaponId: entity.preferredWeaponId ?? entity.preferredWeapon?.id,
      killCount: entity.killCount ?? 0,
      friendlyKillCount: entity.friendlyKillCount ?? 0,
      totalKillCount: entity.totalKillCount ?? 0,
      deathCount: entity.deathCount ?? 0,
      maxStreakCount: entity.maxStreakCount ?? 0,
      fragScore: entity.fragScore ?? 0,
      killVsDeathScore: entity.killVsDeathScore ?? 0,
    }
  }
}
