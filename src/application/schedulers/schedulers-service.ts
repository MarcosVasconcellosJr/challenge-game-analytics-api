import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { MatchesRepository } from '@/domain/repositories/matches-repository'

@Injectable()
export class SchedulersService {
  private readonly logger = new Logger(SchedulersService.name)

  constructor(private matchesRepository: MatchesRepository) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleCron() {
    this.logger.debug('Raised cron refreshMaterializedView')

    try {
      await this.matchesRepository.refreshMaterializedView()
    } catch (err) {
      this.logger.error('Error refreshing MaterializedView', err)
    }
  }
}
