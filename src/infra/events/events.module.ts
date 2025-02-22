import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { OnMatchWithoutDyingEvent } from '@/domain/subscribers/match-without-dying-raised'
import { OnFiveKillsInOneMinute } from '@/domain/subscribers/five-kills-in-one-minute-raised'

@Module({
  imports: [DatabaseModule],
  providers: [OnMatchWithoutDyingEvent, OnFiveKillsInOneMinute],
})
export class EventsModule {}
