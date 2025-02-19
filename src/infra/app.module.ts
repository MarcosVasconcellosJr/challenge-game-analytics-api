import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { envSchema } from 'src/infra/env/env'
import { EnvModule } from 'src/infra/env/env.module'
import { AppController } from '@/application/http/controllers/app.controller'
import { GameFileController } from '@/application/http/controllers/game-file.controller'
import { StorageModule } from 'src/infra/storage/storage.module'
import { QueueConsumerModule } from '@/application/queue-consumer/queue-consumer.module'
import { LogParserService } from 'src/infra/service/log-parser.service'

@Module({
  controllers: [AppController, GameFileController],
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    EnvModule,
    StorageModule,
    QueueConsumerModule,
  ],
  providers: [LogParserService],
})
export class AppModule {}
