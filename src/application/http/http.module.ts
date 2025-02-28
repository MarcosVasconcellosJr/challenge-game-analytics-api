import { Module } from '@nestjs/common'
import { CloudStorageModule } from '@/infra/cloud-storage/cloud-storage.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { EnvModule } from '@/infra/env/env.module'
import { CacheModule } from '@/infra/cache/cache.module'

import { AppController } from '@/application/http/controllers/app.controller'
import { GameFileController } from '@/application/http/controllers/game-file.controller'
import { MatchController } from './controllers/match.controller'

import { LogFileHandler } from '@/application/handlers/log-file.handler'
import { LogLineParser } from '@/application/handlers/log-parser'
import { CreateMatchUseCase } from '@/domain/use-cases/create-match'
import { FetchMatchUseCase } from '@/domain/use-cases/fetch-match'
import { FetchMatchStatisticsUseCase } from '@/domain/use-cases/fetch-match-statistics'
import { FetchMatchGlobalStatisticsUseCase } from '@/domain/use-cases/fetch-match-global-statistics'

@Module({
  imports: [EnvModule, DatabaseModule, CloudStorageModule, CacheModule],
  controllers: [AppController, GameFileController, MatchController],
  providers: [
    LogFileHandler,
    LogLineParser,
    CreateMatchUseCase,
    FetchMatchUseCase,
    FetchMatchStatisticsUseCase,
    FetchMatchGlobalStatisticsUseCase,
  ],
})
export class HttpModule {}
