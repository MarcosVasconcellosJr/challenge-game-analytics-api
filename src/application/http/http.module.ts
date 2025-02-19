import { Module } from '@nestjs/common'
import { StorageModule } from 'src/infra/storage/storage.module'

import { AppController } from './controllers/app.controller'
import { GameFileController } from './controllers/game-file.controller'

@Module({
  imports: [StorageModule],
  controllers: [AppController, GameFileController],
  providers: [],
})
export class HttpModule {}
