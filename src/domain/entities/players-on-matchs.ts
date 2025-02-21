import { Match } from './match'
import { MatchEvent } from './match-event'
import { Player } from './player'
import { Weapon } from './weapon'
import { AggregateRoot } from '@/core/entities/aggregate-root'
import { FiveKillsInOneMinuteEvent } from '../events/five-kills-in-one-minute-event'
import { MatchWithoutDyingEvent } from '../events/match-without-dying-event'
import { Optional } from '@/core/types/optional'

export interface PlayersOnMatchsProps {
  match: Match
  matchId?: string | null
  player: Player
  playerId?: string | null

  killCount: number
  friendlyKillCount: number
  totalKillCount: number
  deathCount: number
  maxStreakCount: number

  preferredWeapon?: Weapon
  preferredWeaponId?: string | null
}

export class PlayersOnMatchs extends AggregateRoot<PlayersOnMatchsProps> {
  constructor(props: PlayersOnMatchsProps) {
    super({
      ...props,
    })
  }

  get matchId() {
    return this.props.matchId
  }

  get playerId() {
    return this.props.playerId
  }

  get preferredWeaponId() {
    return this.props.preferredWeaponId
  }

  get killCount(): number {
    return this.props.killCount ?? 0
  }

  set killCount(killCount: number | undefined | null) {
    this.props.killCount = killCount ?? 0
  }

  get friendlyKillCount(): number {
    return this.props.friendlyKillCount ?? 0
  }

  set friendlyKillCount(friendlyKillCount: number | undefined | null) {
    this.props.friendlyKillCount = friendlyKillCount ?? 0
  }

  get totalKillCount(): number {
    return this.props.totalKillCount ?? 0
  }

  set totalKillCount(totalKillCount: number | undefined | null) {
    this.props.totalKillCount = totalKillCount ?? 0
  }

  get deathCount(): number {
    return this.props.deathCount ?? 0
  }

  set deathCount(deathCount: number | undefined | null) {
    this.props.deathCount = deathCount ?? 0
  }

  get maxStreakCount(): number {
    return this.props.maxStreakCount ?? 0
  }

  set maxStreakCount(maxStreakCount: number | undefined | null) {
    this.props.maxStreakCount = maxStreakCount ?? 0
  }

  get player() {
    return this.props.player
  }

  set player(player: Player) {
    this.props.player = player
  }

  get preferredWeapon(): Weapon | null | undefined {
    return this.props.preferredWeapon
  }

  set preferredWeapon(preferredWeapon: Weapon) {
    this.props.preferredWeapon = preferredWeapon
  }

  get match() {
    return this.props.match
  }

  set match(match: Match) {
    this.props.match = match
  }

  public getPlayerMetrics() {
    if (!this.match.events) return

    let firstKillTime: Date | null = null

    // order before calculate, important for metrics
    this.match.events = this.match.events.sort(
      (a, b) => a.ocurredAt.getTime() - b.ocurredAt.getTime(),
    )

    // iterate only once, for performance purposes
    for (const matchEvent of this.match.events) {
      if (!matchEvent.isKiller(this.player)) {
        this.death()
      } else {
        this.kill(matchEvent)

        firstKillTime = matchEvent.ocurredAt

        if (this.props.deathCount >= 1) {
          this.props.maxStreakCount += 1
        }
      }

      if (this.props.killCount >= 5) {
        if (
          firstKillTime &&
          matchEvent.ocurredAt.getTime() - firstKillTime.getTime() <= 60000
        ) {
          this.addDomainEvent(new FiveKillsInOneMinuteEvent(this.player))
        }
      }
    }

    if (this.props.deathCount === 0) {
      this.addDomainEvent(new MatchWithoutDyingEvent(this.player, this.match))
    }
  }

  private kill(matchEvent: MatchEvent) {
    if (!matchEvent.isFriendlyFire) {
      this.props.killCount += 1
    } else {
      this.props.killCount -= 1
      this.props.friendlyKillCount += 1
    }

    this.props.totalKillCount += 1
  }

  private death() {
    this.props.deathCount += 1
  }

  static create(
    props: Optional<
      PlayersOnMatchsProps,
      | 'preferredWeaponId'
      | 'deathCount'
      | 'killCount'
      | 'friendlyKillCount'
      | 'totalKillCount'
      | 'maxStreakCount'
    >,
  ) {
    const playerOnMatch = new PlayersOnMatchs({
      ...props,
      preferredWeaponId: props.preferredWeapon?.id ?? props.preferredWeaponId,
      deathCount: 0,
      killCount: 0,
      friendlyKillCount: 0,
      totalKillCount: 0,
      maxStreakCount: 0,
    })

    return playerOnMatch
  }
}
