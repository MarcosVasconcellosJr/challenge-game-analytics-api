import { Module, Logger } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { SeqLoggerModule } from '@jasonsoft/nestjs-seq'

import { envSchema } from 'src/infra/env/env'
import { EnvModule } from 'src/infra/env/env.module'
import { StorageModule } from 'src/infra/storage/storage.module'
import { QueueConsumerModule } from '@/application/queue-consumer/queue-consumer.module'
import { HttpModule } from '@/application/http/http.module'
import { CacheModule } from '@/infra/cache/cache.module'
import { EventsModule } from './events/events.module'
import { ScheduleModule } from '@nestjs/schedule'
import { SchedulersService } from '@/application/schedulers/schedulers-service'
import { DatabaseModule } from '@/infra/database/database.module'

@Module({
  controllers: [],
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    SeqLoggerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        serverUrl: configService.get('SEQ_SERVER_URL'),
        extendMetaProperties: {
          serviceName: configService.get('SEQ_SERVICE_NAME'),
        },
        logLevels: ['debug', 'info', 'error'],
      }),
      inject: [ConfigService],
    }),
    HttpModule,
    EnvModule,
    StorageModule,
    QueueConsumerModule,
    CacheModule,
    EventsModule,
    DatabaseModule,
  ],
  providers: [Logger, SchedulersService],
})
export class AppModule {}
