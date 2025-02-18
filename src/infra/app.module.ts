import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { envSchema } from 'src/infra/env/env'
import { EnvModule } from 'src/infra/env/env.module'
import { AppController } from 'src/infra/http/app.controller'
import { UploadController } from 'src/infra/http/log.controller'
import { StorageModule } from 'src/infra/storage/storage.module'
import { QueueConsumerModule } from 'src/infra/queue-consumer/queue-consumer.module'

@Module({
  controllers: [AppController, UploadController],
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    EnvModule,
    StorageModule,
    QueueConsumerModule,
  ],
})
export class AppModule {}
