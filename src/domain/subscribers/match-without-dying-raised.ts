import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'

import { Injectable, Logger } from '@nestjs/common'
import { MatchWithoutDyingEvent } from '../events/match-without-dying-event'
import { AwardRepository } from '../repositories/award-repository'
import { Award } from '../entities/award'

@Injectable()
export class OnMatchWithoutDyingEvent implements EventHandler {
  private readonly logger = new Logger(OnMatchWithoutDyingEvent.name)

  constructor(private awardRepository: AwardRepository) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.giveAward.bind(this),
      MatchWithoutDyingEvent.name,
    )
  }

  private async giveAward(event: MatchWithoutDyingEvent) {
    this.logger.debug('[MatchWithoutDyingEvent] raised event')

    await this.awardRepository.save(
      Award.create({
        playerId: event.player.id,
        title: 'match_without_dying',
      }),
    )
  }
}
