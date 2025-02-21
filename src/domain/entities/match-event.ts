import dayjs from 'dayjs'

import { Entity } from '@/core/entities/entity'
import { Optional } from '@/core/types/optional'
import { Player } from './player'
import { Weapon } from './weapon'

export interface MatchEventProps {
  eventType: string
  ocurredAt: Date
  matchId?: string | null
  weapon: Weapon
  weaponId?: string | null
  killer: Player
  killerId?: string | null
  victim: Player
  victimId?: string | null
  isWorldEvent: boolean
  isFriendlyFire: boolean
  createdAt: Date
  updatedAt?: Date | null
}

export class MatchEvent extends Entity<MatchEventProps> {
  public isKiller(player: Player) {
    return this.props.killer.name === player.name
  }

  public isVictim(player: Player) {
    return this.props.victim.name === player.name
  }

  get eventType() {
    return this.props.eventType
  }

  get ocurredAt() {
    return this.props.ocurredAt
  }

  get matchId() {
    return this.props.matchId
  }

  get weapon() {
    return this.props.weapon
  }

  get weaponId(): string | null | undefined {
    return this.props.weaponId
  }

  set weaponId(weaponId: string | null | undefined) {
    this.props.weaponId = weaponId
  }

  get killer() {
    return this.props.killer
  }

  get killerId(): string | null | undefined {
    return this.props.killerId
  }

  set killerId(killerId: string | null | undefined) {
    this.props.killerId = killerId
  }

  get victim() {
    return this.props.victim
  }

  get victimId(): string | null | undefined {
    return this.props.victimId
  }

  set victimId(victimId: string | null | undefined) {
    this.props.victimId = victimId
  }

  get isWorldEvent() {
    return this.props.isWorldEvent
  }

  get isFriendlyFire() {
    return this.props.isWorldEvent
  }

  set isFriendlyFire(isFriendlyFire: boolean) {
    this.props.isWorldEvent = isFriendlyFire
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

  static create(
    props: Optional<MatchEventProps, 'createdAt' | 'isFriendlyFire'>,
    id?: string,
  ) {
    const matchEvent = new MatchEvent(
      {
        ...props,
        isFriendlyFire:
          props.isFriendlyFire ??
          props.killer?.team?.name === props.victim?.team?.name,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return matchEvent
  }
}
