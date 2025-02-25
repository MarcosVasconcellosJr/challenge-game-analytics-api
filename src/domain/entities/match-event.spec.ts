import { MatchEvent } from '@/domain/entities/match-event'
import { Player } from '@/domain/entities/player'
import { Weapon } from '@/domain/entities/weapon'

describe('MatchEvent Entity', () => {
  let matchId: string
  let eventType: string
  let occurredAt: Date
  let weapon: Weapon
  let killerPlayer: Player
  let victimPlayer: Player
  let isWorldEvent: boolean

  beforeEach(() => {
    matchId = 'match-123'
    eventType = 'kill'
    occurredAt = new Date()
    weapon = { id: 'weapon-1', name: 'AK-47' } as Weapon
    killerPlayer = { id: 'player-1', name: 'Killer', team: { name: 'Team A' } } as Player
    victimPlayer = { id: 'player-2', name: 'Victim', team: { name: 'Team B' } } as Player
    isWorldEvent = false
  })

  it('should create an instance of MatchEvent with a random UUID if no id is provided', () => {
    const matchEvent = new MatchEvent(matchId, eventType, occurredAt, weapon, killerPlayer, victimPlayer, isWorldEvent)

    expect(matchEvent).toBeInstanceOf(MatchEvent)
    expect(matchEvent.id).toBeDefined()
    expect(matchEvent.matchId).toBe(matchId)
    expect(matchEvent.eventType).toBe(eventType)
    expect(matchEvent.occurredAt).toBe(occurredAt)
    expect(matchEvent.weapon).toBe(weapon)
    expect(matchEvent.killerPlayer).toBe(killerPlayer)
    expect(matchEvent.victimPlayer).toBe(victimPlayer)
    expect(matchEvent.isWorldEvent).toBe(isWorldEvent)
    expect(matchEvent.isFriendlyFire).toBe(false)
    expect(matchEvent.createdAt).toBeInstanceOf(Date)
  })

  it('should create an instance of MatchEvent with the provided id', () => {
    const id = 'event-456'
    const matchEvent = new MatchEvent(
      matchId,
      eventType,
      occurredAt,
      weapon,
      killerPlayer,
      victimPlayer,
      isWorldEvent,
      id
    )

    expect(matchEvent.id).toBe(id)
  })

  it('should correctly identify if a player is the killer', () => {
    const matchEvent = new MatchEvent(matchId, eventType, occurredAt, weapon, killerPlayer, victimPlayer, isWorldEvent)

    expect(matchEvent.isKiller(killerPlayer)).toBe(true)
    expect(matchEvent.isKiller(victimPlayer)).toBe(false)
  })

  it('should correctly set isFriendlyFire when killer and victim are on the same team', () => {
    const sameTeamPlayer = { id: 'player-3', name: 'Teammate', team: { name: 'Team A' } } as Player
    const matchEvent = new MatchEvent(
      matchId,
      eventType,
      occurredAt,
      weapon,
      killerPlayer,
      sameTeamPlayer,
      isWorldEvent
    )

    expect(matchEvent.isFriendlyFire).toBe(true)
  })

  it('should return the correct JSON representation of the MatchEvent', () => {
    const matchEvent = new MatchEvent(matchId, eventType, occurredAt, weapon, killerPlayer, victimPlayer, isWorldEvent)

    const json = matchEvent.toJSON()

    expect(json).toEqual({
      eventType,
      occurredAt,
      matchId,
      weapon,
      killerPlayer,
      victimPlayer,
      isWorldEvent,
      isFriendlyFire: false,
      createdAt: matchEvent.createdAt,
    })
  })
})
