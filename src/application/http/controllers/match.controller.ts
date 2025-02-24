import { FetchMatchUseCase } from '@/domain/use-cases/fetch-match'
import { FetchMatchStatisticsUseCase } from '@/domain/use-cases/fetch-match-statistics'
import { Controller, Get, Logger, Param, Query } from '@nestjs/common'
import { FetchMatchGlobalStatisticsUseCase } from '@/domain/use-cases/fetch-match-global-statistics'

@Controller({ path: 'match', version: '1' })
export class MatchController {
  private readonly logger = new Logger(MatchController.name)

  constructor(
    private fetchMatch: FetchMatchUseCase,
    private fetchMatchStatistics: FetchMatchStatisticsUseCase,
    private fetchMatchGlobalStatistics: FetchMatchGlobalStatisticsUseCase
  ) {}

  @Get('/global-statistics')
  async getGlobalStatistics(
    @Query('playerId') playerId: string,
    @Query('playerName') playerName: string,
    @Query('pageSize') limit: number,
    @Query('offset') offset: number
  ) {
    this.logger.debug('getGlobalStatistics called')

    return await this.fetchMatchGlobalStatistics.execute({
      playerId,
      playerName,
      limit,
      offset,
      realTime: false,
    })
  }

  @Get('/global-statistics/real-time')
  async getGlobalStatisticsInRealTime(
    @Query('playerId') playerId: string,
    @Query('playerName') playerName: string,
    @Query('pageSize') limit: number,
    @Query('offset') offset: number
  ) {
    this.logger.debug('getGlobalStatisticsInRealTime called')

    return await this.fetchMatchGlobalStatistics.execute({
      playerId,
      playerName,
      limit,
      offset,
      realTime: true,
    })
  }

  @Get('/:matchId')
  async getMatch(@Param('matchId') matchId: string) {
    this.logger.debug('getMatch called', { matchId })

    const response = await this.fetchMatch.execute({ matchId })
    return response.value?.toJSON()
  }

  @Get('/:matchId/statistics')
  async getMatchStatistics(@Param('matchId') matchId: string) {
    this.logger.debug('getMatchStatistics called', { matchId })

    const response = await this.fetchMatchStatistics.execute({ matchId })
    return response.value?.toJSON()
  }
}
