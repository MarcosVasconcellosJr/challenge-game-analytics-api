import { PlayersOnMatchsRepository } from '@/domain/repositories/players-on-matchs-repository'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { DomainEvents } from '@/core/events/domain-events'
import { PlayersOnMatchs } from '@/domain/entities/players-on-matchs'
import { PrismaPlayersOnMatchsMapper } from '../mappers/prisma-players-on-match-mapper'

@Injectable()
export class PrismaPlayersOnMatchsRepository
  implements PlayersOnMatchsRepository
{
  constructor(private prisma: PrismaService) {}

  async save(playersOnMatchs: PlayersOnMatchs[]): Promise<void> {
    await this.prisma.playersOnMatchs.createMany({
      data: playersOnMatchs.map((playerOnMatch) =>
        PrismaPlayersOnMatchsMapper.toPrisma(playerOnMatch),
      ),
    })

    playersOnMatchs.forEach((agg) => {
      DomainEvents.dispatchEventsForAggregate(agg.id)
    })
  }
}
