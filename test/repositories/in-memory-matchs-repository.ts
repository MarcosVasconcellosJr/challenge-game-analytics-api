import { DomainEvents } from '@/core/events/domain-events'
import { GlobalStatisticsSearch, MatchesRepository } from '@/domain/repositories/matches-repository'
import { Match } from '@/domain/entities/match'
import { GlobalStatisticsViewModel } from '@/application/http/view-model/global-statistics-view-model'

export class InMemoryMatchesRepository implements MatchesRepository {
  public items: Match[] = []

  constructor() {}

  async findById(id: string) {
    const match = this.items.find((item) => item.id.toString() === id)

    if (!match) {
      return null
    }

    return match
  }

  async findWithStatistics(id: string): Promise<Match | null> {
    const match = this.items.find((item) => item.id.toString() === id)

    if (!match) {
      return null
    }

    return match
  }

  async create(match: Match): Promise<void> {
    this.items.push(match)

    DomainEvents.dispatchEventsForAggregate(match.id)
  }

  async save(match: Match) {
    this.items.push(match)

    DomainEvents.dispatchEventsForAggregate(match.id)
  }

  async delete(match: Match) {
    const itemIndex = this.items.findIndex((item) => item.id === match.id)

    this.items.splice(itemIndex, 1)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  findGlobalStatistics(search: GlobalStatisticsSearch): Promise<GlobalStatisticsViewModel[]> {
    const response: GlobalStatisticsViewModel[] = [
      {
        playerId: search.playerId ?? '1',
        playerName: search.playerName ?? 'lindsay',
        totalKillVsDeathScore: 100,
        totalFragScore: 200,
        totalDeathCount: 100,
        totalFriendlyKillCount: 0,
        totalKillCount: 200,
        totalMaxStreakCount: 200,
        totalTotalKillCount: 200,
      },
      {
        playerId: '2',
        playerName: 'bryan',
        totalKillVsDeathScore: 100,
        totalFragScore: 200,
        totalDeathCount: 100,
        totalFriendlyKillCount: 0,
        totalKillCount: 200,
        totalMaxStreakCount: 200,
        totalTotalKillCount: 200,
      },
    ]

    return Promise.resolve(response)
  }

  refreshMaterializedView(): Promise<void> {
    return Promise.resolve() // do nothing
  }
}
