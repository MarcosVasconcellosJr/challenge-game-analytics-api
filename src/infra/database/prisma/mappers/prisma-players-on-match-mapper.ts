import { Prisma } from '@prisma/client'
import { PlayersOnMatchs } from '@/domain/entities/players-on-matchs'

export class PrismaPlayersOnMatchsMapper {
  static toPrisma(
    entity: PlayersOnMatchs,
  ): Prisma.PlayersOnMatchsUncheckedCreateInput {
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
