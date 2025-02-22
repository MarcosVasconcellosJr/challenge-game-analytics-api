import { FetchMatchUseCase } from '@/domain/use-cases/fetch-match'
import { FetchMatchStatisticsUseCase } from '@/domain/use-cases/fetch-match-statistics'
import { Controller, Get, Logger, Param } from '@nestjs/common'

@Controller({ path: 'match', version: '1' })
export class MatchController {
  private readonly logger = new Logger(MatchController.name)

  constructor(
    private fetchMatch: FetchMatchUseCase,
    private fetchMatchStatistics: FetchMatchStatisticsUseCase
  ) {}

  @Get('/:matchId')
  async getMatch(@Param('matchId') matchId: string) {
    this.logger.debug('getMatch called', { matchId })

    return await this.fetchMatch.execute({ matchId })
  }

  @Get('/:matchId/statistics')
  async getMatchStatistics(@Param('matchId') matchId: string) {
    this.logger.debug('getMatchStatistics called', { matchId })

    return await this.fetchMatchStatistics.execute({ matchId })
  }
}
