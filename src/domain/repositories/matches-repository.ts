import { Match } from 'src/domain/entities/match'

export interface GlobalStatisticsSearch {
  playerName?: string
  playerId?: string
  realTime: boolean
  limit: number
  offset: number
}

export abstract class MatchesRepository {
  abstract create(match: Match): Promise<void>
  abstract findById(id: string): Promise<Match | null>
  abstract findWithStatistics(id: string): Promise<Match | null>
  abstract findGlobalStatistics(search: GlobalStatisticsSearch): Promise<any>
  abstract save(match: Match): Promise<void>
  abstract delete(match: Match): Promise<void>
}
