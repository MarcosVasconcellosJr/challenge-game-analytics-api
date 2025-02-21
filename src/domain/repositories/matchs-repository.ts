import { Match } from 'src/domain/entities/match'

export abstract class MatchsRepository {
  abstract findById(id: string): Promise<Match | null>
  abstract save(match: Match): Promise<void>
  abstract delete(match: Match): Promise<void>
}
