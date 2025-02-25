import { Match } from 'src/domain/entities/match'
import { GlobalStatisticsViewModel } from '@/application/http/view-model/global-statistics-view-model'

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
  abstract findGlobalStatistics(search: GlobalStatisticsSearch): Promise<GlobalStatisticsViewModel[]>
  abstract save(match: Match): Promise<void>
  abstract delete(match: Match): Promise<void>
  abstract refreshMaterializedView(): Promise<void>
}
