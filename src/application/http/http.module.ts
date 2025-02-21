import { Module } from '@nestjs/common'
import { StorageModule } from 'src/infra/storage/storage.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { EnvModule } from '@/infra/env/env.module'
import { CacheModule } from '@/infra/cache/cache.module'

import { AppController } from '@/application/http/controllers/app.controller'
import { GameFileController } from '@/application/http/controllers/game-file.controller'

import { LogFileHandler } from '@/infra/handlers/log-file.handler'
import { CreateMatchUseCase } from '@/domain/use-cases/create-match'

@Module({
  imports: [EnvModule, DatabaseModule, StorageModule, CacheModule],
  controllers: [AppController, GameFileController],
  providers: [LogFileHandler, CreateMatchUseCase],
})
export class HttpModule {}
