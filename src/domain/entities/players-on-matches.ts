import { Match } from './match'
import { MatchEvent } from './match-event'
import { Player } from './player'
import { Weapon } from './weapon'
import { AggregateRoot } from '@/core/entities/aggregate-root'
import { FiveKillsInOneMinuteEvent } from '../events/five-kills-in-one-minute-event'
import { MatchWithoutDyingEvent } from '../events/match-without-dying-event'
import { Logger } from '@nestjs/common'

export class PlayersOnMatches extends AggregateRoot {
  public match: Match
  public matchId?: string | null
  public player: Player
  public playerId?: string | null
  public killCount: number
  public friendlyKillCount: number
  public totalKillCount: number
  public deathCount: number
  public maxStreakCount: number
  public fragScore: number
  public killVsDeathScore: number
  public preferredWeapon?: Weapon
  public preferredWeaponId?: string | null
  private fiveKillsInOneMinuteEventRaised: boolean = false

  private logger: Logger

  constructor(
    match: Match,
    player: Player,
    killCount?: number,
    friendlyKillCount?: number,
    totalKillCount?: number,
    deathCount?: number,
    maxStreakCount?: number
  ) {
    super()
    this.match = match
    this.player = player
    this.killCount = killCount ?? 0
    this.friendlyKillCount = friendlyKillCount ?? 0
    this.totalKillCount = totalKillCount ?? 0
    this.deathCount = deathCount ?? 0
    this.maxStreakCount = maxStreakCount ?? 0
    this.fragScore = 0
    this.killVsDeathScore = 0
    this.logger = new Logger('Entity/PlayersOnMatches')
  }

  public calculateFragScore(): number {
    this.fragScore = this.killCount - this.friendlyKillCount
    return this.fragScore
  }

  public calculateKillVsDeathScore(): number {
    this.killVsDeathScore = this.fragScore - this.deathCount
    return this.killVsDeathScore
  }

  public getPlayerMetrics(): void {
    if (!this.match.matchEvents) {
      this.logger.debug('No match events found for player metrics calculation.')
      return
    }

    this.sortMatchEventsChronologically()
    this.calculateMetrics()
    this.checkForSpecialAchievements()
    this.getPreferredWeapon()
  }

  private sortMatchEventsChronologically(): void {
    this.match.matchEvents = this.match.matchEvents.sort((a, b) => a.occurredAt.getTime() - b.occurredAt.getTime())
  }

  private getEventsAsParticipant() {
    return this.match.matchEvents.filter(
      (matchEvent) =>
        matchEvent.killerPlayer.name === this.player.name || matchEvent.victimPlayer.name === this.player.name
    )
  }

  private calculateMetrics(): void {
    let firstKillTime: Date | null = null

    const eventsAsParticipant = this.getEventsAsParticipant()

    for (const matchEvent of eventsAsParticipant) {
      if (!matchEvent.isKiller(this.player)) {
        this.handleDeath()
      } else {
        this.handleKill(matchEvent)
        firstKillTime = this.updateFirstKillTime(firstKillTime, matchEvent)
        this.updateMaxStreakCount()
      }

      this.checkForFiveKillsInOneMinute(firstKillTime, matchEvent)
    }

    this.calculateFragScore()
    this.calculateKillVsDeathScore()
  }

  public handleKill(matchEvent: MatchEvent): void {
    if (!matchEvent.isFriendlyFire) {
      this.killCount += 1
    } else {
      this.friendlyKillCount += 1
    }

    this.totalKillCount += 1
  }

  public handleDeath(): void {
    this.deathCount += 1
  }

  public updateFirstKillTime(firstKillTime: Date | null, matchEvent: MatchEvent): Date | null {
    if (!firstKillTime) {
      firstKillTime = matchEvent.occurredAt
    }
    return firstKillTime
  }

  public updateMaxStreakCount(): void {
    if (this.deathCount === 0) {
      this.maxStreakCount += 1
    }
  }

  public checkForFiveKillsInOneMinute(firstKillTime: Date | null, matchEvent: MatchEvent): void {
    if (this.killCount >= 5 && firstKillTime) {
      const timeDifference = matchEvent.occurredAt.getTime() - firstKillTime.getTime()
      if (timeDifference <= 60000 && !this.fiveKillsInOneMinuteEventRaised) {
        this.addDomainEvent(new FiveKillsInOneMinuteEvent(this.player))
        this.fiveKillsInOneMinuteEventRaised = true
      }
    }
  }

  public checkForSpecialAchievements(): void {
    if (this.deathCount === 0) {
      this.addDomainEvent(new MatchWithoutDyingEvent(this.player, this.match))
    }
  }

  public getPreferredWeapon() {
    const eventsAsKiller = this.match.matchEvents.filter((matchEvent) => matchEvent.isKiller(this.player))

    const weaponUsage = this.getWeaponsUsage(eventsAsKiller)

    const weaponUsageCounter = Array.from(weaponUsage)

    const preferredWeaponCounter = weaponUsageCounter.sort((a, b) => b[1] - a[1])[0]

    if (preferredWeaponCounter) {
      const preferredWeaponName = preferredWeaponCounter[0]

      this.preferredWeapon = eventsAsKiller.find((matchEvent) => matchEvent.weapon.name === preferredWeaponName)?.weapon

      this.preferredWeaponId = this.preferredWeapon?.id
    }
  }

  private getWeaponsUsage(matchEvents: MatchEvent[]) {
    const weaponCounter = new Map<string, number>()

    for (const event of matchEvents) {
      const counter = weaponCounter.get(event.weapon.name)

      weaponCounter.set(event.weapon.name, (counter ?? 0) + 1)
    }

    return weaponCounter
  }

  toJSON(): any {
    return {
      matchId: this.matchId,
      player: this.player,
      playerId: this.playerId,
      killCount: this.killCount,
      friendlyKillCount: this.friendlyKillCount,
      totalKillCount: this.totalKillCount,
      deathCount: this.deathCount,
      maxStreakCount: this.maxStreakCount,
      fragScore: this.fragScore,
      killVsDeathScore: this.killVsDeathScore,
      preferredWeapon: this.preferredWeapon,
      preferredWeaponId: this.preferredWeaponId,
    }
  }
}
