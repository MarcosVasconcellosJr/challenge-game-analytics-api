import dayjs from 'dayjs'

import { AggregateRoot } from '@/core/entities/aggregate-root'
import { Optional } from '@/core/types/optional'
import { MatchPlayerWinnningChosenEvent } from '../events/match-player-winninng-chosen-event'
import { MatchTeamWinnningChosenEvent } from '../events/match-team-winninng-chosen-event copy'
import { MatchEvent } from './match-event'
import { Team } from './team'
import { Player } from './player'
import { MatchCreatedEvent } from '../events/match-created-event'
import { randomUUID } from 'node:crypto'

export interface MatchProps {
  startedAt: Date
  endedAt: Date | null
  winningTeam?: Team
  winningTeamId?: string | null
  winningPlayer?: Player
  winningPlayerId?: string | null
  events: MatchEvent[]
  createdAt: Date
  updatedAt?: Date | null
}

export class Match extends AggregateRoot<MatchProps> {
  get startedAt() {
    return this.props.startedAt
  }

  get endedAt() {
    return this.props.endedAt!
  }

  set endedAt(endedAt: Date) {
    this.props.endedAt = endedAt
  }

  get winningTeamId() {
    return this.props.winningTeamId
  }

  set winningTeamId(winningTeamId: string | undefined | null) {
    if (winningTeamId === undefined || winningTeamId === null) {
      return
    }

    if (
      this.props.winningTeamId === undefined ||
      this.props.winningTeamId === null ||
      !(winningTeamId === this.props.winningTeamId)
    ) {
      this.addDomainEvent(new MatchTeamWinnningChosenEvent(this, winningTeamId))
    }

    this.props.winningTeamId = winningTeamId

    this.touch()
  }

  get winningPlayerId() {
    return this.props.winningPlayerId
  }

  set winningPlayerId(winningPlayerId: string | undefined | null) {
    if (winningPlayerId === undefined || winningPlayerId === null) {
      return
    }

    if (
      this.props.winningPlayerId === undefined ||
      this.props.winningPlayerId === null ||
      !(winningPlayerId === this.props.winningPlayerId)
    ) {
      this.addDomainEvent(
        new MatchPlayerWinnningChosenEvent(this, winningPlayerId),
      )
    }

    this.props.winningPlayerId = winningPlayerId

    this.touch()
  }

  get events() {
    return this.props.events
  }

  set events(events: MatchEvent[]) {
    this.props.events = events
    this.touch()
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get isNew(): boolean {
    return dayjs().diff(this.createdAt, 'days') <= 3
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  public addMatchEvent(matchEvent: MatchEvent) {
    if (!this.events) {
      this.events = []
    }

    this.events.push(matchEvent)
  }

  public getEventsAsKiller(player: Player) {
    const eventsAsKiller = this.props.events.filter(
      (event) => event.killer.name === player.name,
    )

    return eventsAsKiller
  }

  public getEventsAsVictim(player: Player) {
    const eventsAsKiller = this.props.events.filter(
      (event) => event.victim.name === player.name,
    )

    return eventsAsKiller
  }

  static create(
    props: Optional<MatchProps, 'createdAt' | 'endedAt' | 'events'> & {
      id?: string
    },
  ) {
    const match = new Match(
      {
        ...props,
        endedAt: props.endedAt ?? null,
        events: props.events ?? [],
        createdAt: props.createdAt ?? new Date(),
      },
      props.id ?? randomUUID(),
    )

    match.addDomainEvent(new MatchCreatedEvent(match))

    return match
  }
}
