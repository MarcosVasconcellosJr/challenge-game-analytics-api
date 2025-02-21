import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { CacheModule } from '@/infra/cache/cache.module'

import { MatchsRepository } from '@/domain/repositories/matchs-repository'
import { PlayersOnMatchsRepository } from '@/domain/repositories/players-on-matchs-repository'

import { PrismaMatchsRepository } from './prisma/repositories/prisma-matchs-repository'
import { PrismaPlayersOnMatchsRepository } from './prisma/repositories/players-on-matchs-repository'
import { AwardRepository } from '@/domain/repositories/award-repository'
import { PrismaAwardRepository } from './prisma/repositories/award-repository'

@Module({
  imports: [CacheModule],
  providers: [
    PrismaService,
    {
      provide: MatchsRepository,
      useClass: PrismaMatchsRepository,
    },
    {
      provide: PlayersOnMatchsRepository,
      useClass: PrismaPlayersOnMatchsRepository,
    },
    {
      provide: AwardRepository,
      useClass: PrismaAwardRepository,
    },
  ],
  exports: [
    PrismaService,
    MatchsRepository,
    PlayersOnMatchsRepository,
    AwardRepository,
  ],
})
export class DatabaseModule {}
