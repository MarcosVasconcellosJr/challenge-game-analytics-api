import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { OnMatchCreated } from '@/domain/subscribers/on-match-created'
import { GenerateMatchMetricsUseCase } from '@/domain/use-cases/generate-match-metrics'
import { OnMatchWithoutDyingEvent } from '@/domain/subscribers/match-without-dying-raised'
import { FiveKillsInOneMinuteEvent } from '@/domain/events/five-kills-in-one-minute-event'

@Module({
  imports: [DatabaseModule],
  providers: [
    OnMatchCreated,
    OnMatchWithoutDyingEvent,
    FiveKillsInOneMinuteEvent,
    GenerateMatchMetricsUseCase,
  ],
})
export class EventsModule {}
