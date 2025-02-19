import { Module, Logger } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { SeqLoggerModule } from '@jasonsoft/nestjs-seq'

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
    SeqLoggerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        serverUrl: configService.get('SEQ_SERVER_URL'),
        // apiKey: configService.get('SEQ_API_KEY'),
        extendMetaProperties: {
          serviceName: configService.get('SEQ_SERVICE_NAME'),
        },
        logLevels: ['debug', 'info', 'error'],
      }),
      inject: [ConfigService],
    }),
    EnvModule,
    StorageModule,
    QueueConsumerModule,
  ],
  providers: [Logger, LogParserService],
})
export class AppModule {}
