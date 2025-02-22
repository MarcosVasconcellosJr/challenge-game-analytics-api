import { Module } from '@nestjs/common'
import { StorageModule } from 'src/infra/storage/storage.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { EnvModule } from '@/infra/env/env.module'
import { CacheModule } from '@/infra/cache/cache.module'

import { AppController } from '@/application/http/controllers/app.controller'
import { GameFileController } from '@/application/http/controllers/game-file.controller'
import { MatchController } from './controllers/match.controller'

import { LogFileHandler } from '@/infra/handlers/log-file.handler'
import { LogLineParser } from '@/infra/handlers/log-parser'
import { CreateMatchUseCase } from '@/domain/use-cases/create-match'
import { FetchMatchUseCase } from '@/domain/use-cases/fetch-match'
import { FetchMatchStatisticsUseCase } from '@/domain/use-cases/fetch-match-statistics'

@Module({
  imports: [EnvModule, DatabaseModule, StorageModule, CacheModule],
  controllers: [AppController, GameFileController, MatchController],
  providers: [LogFileHandler, LogLineParser, CreateMatchUseCase, FetchMatchUseCase, FetchMatchStatisticsUseCase],
})
export class HttpModule {}
