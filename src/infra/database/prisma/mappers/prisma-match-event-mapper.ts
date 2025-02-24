import { Prisma } from '@prisma/client'
import { MatchEvent } from '@/domain/entities/match-event'

export class PrismaMatchEventMapper {
  static toPrisma(matchEvent: MatchEvent): Prisma.MatchEventUncheckedCreateInput {
    return {
      occurredAt: matchEvent.occurredAt,
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
