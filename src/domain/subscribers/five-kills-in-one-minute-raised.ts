import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'

import { Injectable, Logger } from '@nestjs/common'
import { FiveKillsInOneMinuteEvent } from '../events/five-kills-in-one-minute-event'
import { AwardRepository } from '../repositories/award-repository'
import { Award } from '../entities/award'

@Injectable()
export class OnFiveKillsInOneMinute implements EventHandler {
  private readonly logger = new Logger(OnFiveKillsInOneMinute.name)

  constructor(private awardRepository: AwardRepository) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(this.giveAward.bind(this), FiveKillsInOneMinuteEvent.name)
  }

  private async giveAward(event: FiveKillsInOneMinuteEvent) {
    this.logger.debug('[FiveKillsInOneMinuteEvent] raised event')

    await this.awardRepository.save(new Award('5_kills_in_on_minute', event.player.id))
  }
}
