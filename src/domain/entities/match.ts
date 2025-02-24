import { AggregateRoot } from '@/core/entities/aggregate-root'
import { MatchEvent } from './match-event'
import { Team } from './team'
import { Player } from './player'
import { PlayersOnMatches } from '@/domain/entities/players-on-matches'
import { Weapon } from '@/domain/entities/weapon'

export class Match extends AggregateRoot {
  public id: string
  public startedAt: Date
  public endedAt?: Date
  public createdAt: Date
  public updatedAt?: Date | null
  public winningTeam?: Team
  public winningTeamId?: string | null
  public winningPlayer?: Player
  public winningPlayerId?: string | null
  private _matchEvents: MatchEvent[] = []
  private _playersOnMatches: PlayersOnMatches[] = []

  constructor(
    startedAt: Date,
    endedAt?: Date | null,
    matchEvents?: MatchEvent[] | null,
    playersOnMatches?: PlayersOnMatches[] | null,
    id?: string
  ) {
    super()
    this.id = id ?? crypto.randomUUID()
    this.createdAt = new Date()
    this.startedAt = startedAt

    if (endedAt) {
      this.endedAt = endedAt
    }

    if (matchEvents) {
      this._matchEvents = matchEvents
    }

    if (playersOnMatches) {
      this._playersOnMatches = playersOnMatches
    }
  }

  public addMatchEvent(
    eventType: string,
    occurredAt: Date,
    weapon: Weapon,
    killerPlayer: Player,
    victimPlayer: Player,
    isWorldEvent: boolean
  ) {
    if (!this._matchEvents) this._matchEvents = []

    this._matchEvents.push(
      new MatchEvent(this.id, eventType, occurredAt, weapon, killerPlayer, victimPlayer, isWorldEvent)
    )
  }

  get matchEvents() {
    return this._matchEvents
  }

  set matchEvents(matchEvents: MatchEvent[]) {
    this._matchEvents = matchEvents
  }

  public addPlayerOnMatch(player: Player) {
    if (!this._playersOnMatches) this._playersOnMatches = []

    this._playersOnMatches.push(new PlayersOnMatches(this, player))
  }

  get playersOnMatches() {
    return this._playersOnMatches
  }

  set playersOnMatches(playersOnMatches: PlayersOnMatches[]) {
    this._playersOnMatches = playersOnMatches
  }

  public setWinningPlayer() {
    const orderedPlayers = this._playersOnMatches.sort((a, b) => b.killVsDeathScore - a.killVsDeathScore)
    this.winningPlayer = orderedPlayers[0]?.player
    this.winningPlayerId = this.winningPlayer?.id
  }

  toJSON() {
    return {
      id: this.id,
      startedAt: this.startedAt,
      endedAt: this.endedAt,
      winningTeam: this.winningTeam?.toJSON(),
      winningPlayer: this.winningPlayer?.toJSON(),
      matchEvents: this._matchEvents?.map((matchEvent) => matchEvent.toJSON()),
      playersOnMatches: this._playersOnMatches?.map((playerOnMatch) => playerOnMatch.toJSON()),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }
}
