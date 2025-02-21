import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { MatchsRepository } from '@/domain/repositories/matchs-repository'
import { PrismaMatchsRepository } from './prisma/repositories/prisma-matchs-repository'
import { CacheModule } from '@/infra/cache/cache.module'

@Module({
  imports: [CacheModule],
  providers: [
    PrismaService,
    {
      provide: MatchsRepository,
      useClass: PrismaMatchsRepository,
    },
  ],
  exports: [PrismaService, MatchsRepository],
})
export class DatabaseModule {}
