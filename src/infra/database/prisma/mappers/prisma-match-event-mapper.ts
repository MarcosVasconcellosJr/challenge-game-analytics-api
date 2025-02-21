import { Prisma } from '@prisma/client'
import { MatchEvent } from '@/domain/entities/match-event'

export class PrismaMatchEventMapper {
  static toPrisma(
    matchEvent: MatchEvent,
  ): Prisma.MatchEventUncheckedCreateInput {
    return {
      id: matchEvent.id?.toString(),
      ocurredAt: matchEvent.ocurredAt,
      eventType: matchEvent.eventType,
      matchId: `${matchEvent.matchId}`,
      weaponId: `${matchEvent.weaponId}`,
      killerId: `${matchEvent.killerId}`,
      victimId: `${matchEvent.victimId}`,
      isWorldEvent: matchEvent.isWorldEvent,
      isFriendlyFire: matchEvent.isFriendlyFire,
    }
  }
}
