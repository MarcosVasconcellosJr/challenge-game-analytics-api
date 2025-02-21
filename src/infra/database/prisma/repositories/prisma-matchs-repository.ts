import { MatchsRepository } from '@/domain/repositories/matchs-repository'
import { Match } from '@/domain/entities/match'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaMatchMapper } from '../mappers/prisma-match-mapper'
import { DomainEvents } from '@/core/events/domain-events'
import { CacheRepository } from '@/infra/cache/cache-repository'

@Injectable()
export class PrismaMatchsRepository implements MatchsRepository {
  constructor(
    private prisma: PrismaService,
    private cache: CacheRepository,
  ) {}

  async findById(id: string): Promise<Match | null> {
    const match = await this.prisma.match.findUnique({
      where: { id },
    })

    if (!match) {
      return null
    }

    return PrismaMatchMapper.toDomain(match)
  }

  async save(match: Match): Promise<void> {
    const data = PrismaMatchMapper.toPrisma(match)

    await this.prisma.$transaction(async (prisma) => {
      const matchCreated = await prisma.match.create({
        data,
      })

      for await (const event of match.events) {
        // weapon
        const weapon = await prisma.weapon.upsert({
          where: { name: event.weapon.name },
          update: { name: event.weapon.name },
          create: { name: event.weapon.name },
        })

        // killer
        const killerTeam = await prisma.team.upsert({
          where: { name: event.killer.team.name },
          update: { name: event.killer.team.name },
          create: { name: event.killer.team.name },
        })
        const killer = await prisma.player.upsert({
          where: { name: event.killer.name },
          update: { name: event.killer.name, teamId: killerTeam.id },
          create: { name: event.killer.name, teamId: killerTeam.id },
        })

        // victim
        const victimTeam = await prisma.team.upsert({
          where: { name: event.victim.team.name },
          update: { name: event.victim.team.name },
          create: { name: event.victim.team.name },
        })
        const victim = await prisma.player.upsert({
          where: { name: event.victim.name },
          update: { name: event.victim.name, teamId: victimTeam.id },
          create: { name: event.victim.name, teamId: victimTeam.id },
        })

        await prisma.matchEvent.create({
          data: {
            matchId: matchCreated.id,
            eventType: event.eventType,
            ocurredAt: event.ocurredAt,
            weaponId: weapon.id,
            killerId: killer.id,
            victimId: victim.id,
            isWorldEvent: event.isWorldEvent,
            isFriendlyFire: event.isFriendlyFire,
          },
        })
      }
    })

    DomainEvents.dispatchEventsForAggregate(match.id)
  }

  async delete(question: Match): Promise<void> {
    const data = PrismaMatchMapper.toPrisma(question)

    await this.prisma.match.delete({
      where: {
        id: data.id,
      },
    })

    // TODO: SALVAR NO CACHE
    // this.cache.delete(`question:${data.slug}:details`)
  }
}
