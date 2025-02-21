import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'

import { Injectable, Logger } from '@nestjs/common'
import { MatchCreatedEvent } from '../events/match-created-event'
import { MatchsRepository } from '../repositories/matchs-repository'
import { GenerateMatchMetricsUseCase } from '../use-cases/generate-match-metrics'

@Injectable()
export class OnMatchCreated implements EventHandler {
  private readonly logger = new Logger(OnMatchCreated.name)

  constructor(
    private matchsRepository: MatchsRepository,
    private generateMatchMetrics: GenerateMatchMetricsUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.generateMetrics.bind(this),
      MatchCreatedEvent.name,
    )
  }

  private async generateMetrics(event: MatchCreatedEvent) {
    this.logger.debug('[MatchCreatedEvent] raised event')

    const match = await this.matchsRepository.findById(event.match.id)

    if (match) {
      await this.generateMatchMetrics.execute(event.match)
    }
  }
}
