import { Module } from '@nestjs/common'
import { CloudStorageModule } from '@/infra/cloud-storage/cloud-storage.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { EnvModule } from '@/infra/env/env.module'
import { CacheModule } from '@/infra/cache/cache.module'
import { CreateMatchUseCase } from '@/domain/use-cases/create-match'
import { LogLineParser } from '@/application/handlers/log-parser'
import { LogFileHandler } from '@/application/handlers/log-file.handler'

@Module({
  imports: [CloudStorageModule, DatabaseModule, EnvModule, CacheModule],
  providers: [LogFileHandler, CreateMatchUseCase, LogLineParser],
  exports: [LogFileHandler],
})
export class HandlersModule {}
