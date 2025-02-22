import { Entity } from '@/core/entities/entity'
import { Player } from './player'
import { Weapon } from '@/domain/entities/weapon'

export class MatchEvent extends Entity {
  public id: string
  public eventType: string
  public occurredAt: Date
  public matchId: string
  public weapon: Weapon
  public weaponId?: string | null
  public killerPlayer: Player
  public killerId?: string | null
  public victimPlayer: Player
  public victimId?: string | null
  public isWorldEvent: boolean
  public isFriendlyFire: boolean
  public createdAt: Date
  public updatedAt?: Date | null

  constructor(
    matchId: string,
    eventType: string,
    occurredAt: Date,
    weapon: Weapon,
    killerPlayer: Player,
    victimPlayer: Player,
    isWorldEvent: boolean,
    id?: string
  ) {
    super()
    this.id = id ?? crypto.randomUUID()
    this.createdAt = new Date()
    this.matchId = matchId
    this.eventType = eventType
    this.occurredAt = occurredAt
    this.weapon = weapon
    this.killerPlayer = killerPlayer
    this.victimPlayer = victimPlayer
    this.isWorldEvent = isWorldEvent
    this.isFriendlyFire = killerPlayer?.team?.name === victimPlayer?.team?.name
  }

  public isKiller(player: Player) {
    return this.killerPlayer.name === player.name
  }

  toJSON() {
    return {
      eventType: this.eventType,
      occurredAt: this.occurredAt,
      matchId: this.matchId,
      weapon: this.weapon,
      weaponId: this.weaponId,
      killerPlayer: this.killerPlayer,
      killerId: this.killerId,
      victimPlayer: this.victimPlayer,
      victimId: this.victimId,
      isWorldEvent: this.isWorldEvent,
      isFriendlyFire: this.isFriendlyFire,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }
}
