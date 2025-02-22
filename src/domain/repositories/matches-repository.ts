import { Match } from 'src/domain/entities/match'

export abstract class MatchesRepository {
  abstract create(match: Match): Promise<void>
  abstract findById(id: string): Promise<Match | null>
  abstract findWithStatistics(id: string): Promise<Match | null>
  abstract save(match: Match): Promise<void>
  abstract delete(match: Match): Promise<void>
}
