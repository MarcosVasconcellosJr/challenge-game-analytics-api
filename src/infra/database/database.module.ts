import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { CacheModule } from '@/infra/cache/cache.module'

import { MatchesRepository } from '@/domain/repositories/matches-repository'
import { PrismaMatchesRepository } from './prisma/repositories/prisma-matchs-repository'

import { AwardRepository } from '@/domain/repositories/award-repository'
import { PrismaAwardRepository } from './prisma/repositories/award-repository'

@Module({
  imports: [CacheModule],
  providers: [
    PrismaService,
    {
      provide: MatchesRepository,
      useClass: PrismaMatchesRepository,
    },
    {
      provide: AwardRepository,
      useClass: PrismaAwardRepository,
    },
  ],
  exports: [PrismaService, MatchesRepository, AwardRepository],
})
export class DatabaseModule {}
