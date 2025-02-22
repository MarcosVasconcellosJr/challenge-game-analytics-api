import { Match } from './match'
import { MatchEvent } from './match-event'
import { Weapon } from './weapon'
import { Player } from '@/domain/entities/player'
import { PlayersOnMatches } from '@/domain/entities/players-on-matches'
import { MatchWithoutDyingEvent } from '@/domain/events/match-without-dying-event'
import { FiveKillsInOneMinuteEvent } from '@/domain/events/five-kills-in-one-minute-event'
import { beforeEach } from 'vitest'
import { Team } from '@/domain/entities/team'

describe('PlayersOnMatches Entity', () => {
  let match: Match
  let player1: Player
  let player2: Player
  let weapon: Weapon
  let matchEvent: MatchEvent
  let startedAt: Date
  let team1: Team
  let team2: Team

  beforeEach(() => {
    startedAt = new Date()
    team1 = new Team('Team A')
    team2 = new Team('Team B')
    player1 = new Player('Player1', team1, 'player-1')
    player2 = new Player('Player2', team2, 'player-2')
    weapon = new Weapon('AK-47', 'weapon-1')
    match = new Match(startedAt)
    matchEvent = new MatchEvent(match.id, 'kill', new Date(), weapon, player1, player2, false, 'event-1')
  })

  it('should create an instance of PlayersOnMatches with default values', () => {
    const playersOnMatches = new PlayersOnMatches(match, player1)

    expect(playersOnMatches).toBeInstanceOf(PlayersOnMatches)
    expect(playersOnMatches.match).toBe(match)
    expect(playersOnMatches.player).toBe(player1)
    expect(playersOnMatches.killCount).toBe(0)
    expect(playersOnMatches.friendlyKillCount).toBe(0)
    expect(playersOnMatches.totalKillCount).toBe(0)
    expect(playersOnMatches.deathCount).toBe(0)
    expect(playersOnMatches.maxStreakCount).toBe(0)
    expect(playersOnMatches.fragScore).toBe(0)
    expect(playersOnMatches.killVsDeathScore).toBe(0)
  })

  it('should calculate frag score correctly', () => {
    const playersOnMatches = new PlayersOnMatches(match, player1, 10, 2)
    playersOnMatches.calculateFragScore()

    expect(playersOnMatches.fragScore).toBe(8) // killCount - friendlyKillCount = 10 - 2 = 8
  })

  it('should calculate kill vs death score correctly', () => {
    const playersOnMatches = new PlayersOnMatches(match, player1, 10, 2, 10, 5)
    playersOnMatches.calculateFragScore()
    playersOnMatches.calculateKillVsDeathScore()

    expect(playersOnMatches.killVsDeathScore).toBe(3) // fragScore - deathCount = 8 - 5 = 3
  })

  it('should handle kill correctly', () => {
    const playersOnMatches = new PlayersOnMatches(match, player1)
    playersOnMatches.handleKill(matchEvent)

    expect(playersOnMatches.killCount).toBe(1)
    expect(playersOnMatches.totalKillCount).toBe(1)
  })

  it('should handle friendly fire kill correctly', () => {
    const friendlyFireEvent = { ...matchEvent, isFriendlyFire: true }
    const playersOnMatches = new PlayersOnMatches(match, player1)
    playersOnMatches.handleKill(friendlyFireEvent as MatchEvent)

    expect(playersOnMatches.friendlyKillCount).toBe(1)
    expect(playersOnMatches.totalKillCount).toBe(1)
  })

  it('should handle death correctly', () => {
    const playersOnMatches = new PlayersOnMatches(match, player1)
    playersOnMatches.handleDeath()

    expect(playersOnMatches.deathCount).toBe(1)
  })

  it('should update max streak count correctly when there are no deaths', () => {
    const playersOnMatches = new PlayersOnMatches(match, player1)
    playersOnMatches.handleKill(matchEvent)
    playersOnMatches.updateMaxStreakCount()

    expect(playersOnMatches.maxStreakCount).toBe(1)
  })

  it('should not update max streak count when there are deaths', () => {
    const playersOnMatches = new PlayersOnMatches(match, player1)
    playersOnMatches.handleDeath()
    playersOnMatches.handleKill(matchEvent)
    playersOnMatches.updateMaxStreakCount()

    expect(playersOnMatches.maxStreakCount).toBe(0)
  })

  it('should check for five kills in one minute achievement', () => {
    const playersOnMatches = new PlayersOnMatches(match, player1)
    const firstKillTime = new Date()
    const events = Array.from({ length: 5 }, (_, i) => ({
      ...matchEvent,
      occurredAt: new Date(firstKillTime.getTime() + i * 10000), // 10 seconds apart
    }))

    events.forEach((event) => {
      playersOnMatches.handleKill(event as MatchEvent)
      playersOnMatches.checkForFiveKillsInOneMinute(firstKillTime, event as MatchEvent)
    })

    expect(playersOnMatches.domainEvents).toContainEqual(expect.any(FiveKillsInOneMinuteEvent))
  })

  it('should check for match without dying achievement', () => {
    const playersOnMatches = new PlayersOnMatches(match, player1)
    playersOnMatches.checkForSpecialAchievements()

    expect(playersOnMatches.domainEvents).toContainEqual(expect.any(MatchWithoutDyingEvent))
  })

  it('should get preferred weapon correctly', () => {
    const playersOnMatches = new PlayersOnMatches(match, player1)

    match.addMatchEvent(
      matchEvent.eventType,
      matchEvent.occurredAt,
      new Weapon('AK-47', 'weapon-1'),
      matchEvent.killerPlayer,
      matchEvent.victimPlayer,
      matchEvent.isWorldEvent
    )

    match.addMatchEvent(
      matchEvent.eventType,
      matchEvent.occurredAt,
      new Weapon('M4A1', 'weapon-2'),
      matchEvent.killerPlayer,
      matchEvent.victimPlayer,
      matchEvent.isWorldEvent
    )

    match.addMatchEvent(
      matchEvent.eventType,
      matchEvent.occurredAt,
      new Weapon('AK-47', 'weapon-1'),
      matchEvent.killerPlayer,
      matchEvent.victimPlayer,
      matchEvent.isWorldEvent
    )

    playersOnMatches.getPreferredWeapon()

    expect(playersOnMatches.preferredWeapon?.name).toBe('AK-47')
    expect(playersOnMatches.preferredWeaponId).toBe('weapon-1')
  })
})
