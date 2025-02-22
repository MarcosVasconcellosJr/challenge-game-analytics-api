import { describe, it, expect, beforeEach } from 'vitest'
import { Match } from '@/domain/entities/match'
import { Team } from '@/domain/entities/team'
import { Player } from '@/domain/entities/player'
import { Weapon } from '@/domain/entities/weapon'

describe('Match Entity', () => {
  let match: Match
  let startedAt: Date
  let player1: Player
  let player2: Player
  let player3: Player
  let team1: Team
  let team2: Team
  let weapon: Weapon

  beforeEach(() => {
    startedAt = new Date()

    team1 = new Team('Team 1')
    team2 = new Team('Team 2')
    player1 = new Player('Player 1', team1)
    player2 = new Player('Player 2', team2)
    player3 = new Player('Player 3', team2)
    weapon = new Weapon('Knife', 'Melee')

    match = new Match(startedAt)
  })

  it('should create a match with default values', () => {
    expect(match.id).toBeDefined()
    expect(match.startedAt).toEqual(startedAt)
    expect(match.createdAt).toBeInstanceOf(Date)
    expect(match.endedAt).toBeUndefined()
    expect(match.winningTeam).toBeUndefined()
    expect(match.winningPlayer).toBeUndefined()
    expect(match.matchEvents).toEqual([])
    expect(match.playersOnMatches).toEqual([])
  })

  it('should add a match event', () => {
    const eventType = 'kill'
    const occurredAt = new Date()
    const killerPlayer = player1
    const victimPlayer = player2
    const isWorldEvent = false

    match.addMatchEvent(eventType, occurredAt, weapon, killerPlayer, victimPlayer, isWorldEvent)

    expect(match.matchEvents.length).toBe(1)
    expect(match.matchEvents[0].eventType).toBe(eventType)
    expect(match.matchEvents[0].occurredAt).toEqual(occurredAt)
    expect(match.matchEvents[0].weapon).toEqual(weapon)
    expect(match.matchEvents[0].killerPlayer).toEqual(killerPlayer)
    expect(match.matchEvents[0].victimPlayer).toEqual(victimPlayer)
    expect(match.matchEvents[0].isWorldEvent).toBe(isWorldEvent)
  })

  it('should set the winning player based on kill vs death score', () => {
    match.addMatchEvent('kill', new Date(), weapon, player1, player2, false)
    match.addMatchEvent('kill', new Date(), weapon, player1, player2, false)
    match.addMatchEvent('kill', new Date(), weapon, player1, player2, false)
    match.addMatchEvent('kill', new Date(), weapon, player2, player1, false)
    match.addMatchEvent('kill', new Date(), weapon, player2, player3, false)
    match.addMatchEvent('kill', new Date(), weapon, player2, player3, false)

    match.addPlayerOnMatch(player1)
    match.addPlayerOnMatch(player2)
    match.addPlayerOnMatch(player3)

    match.playersOnMatches.forEach((playerOnMatch) => {
      playerOnMatch.getPlayerMetrics()
    })

    match.setWinningPlayer()

    expect(match.winningPlayer?.name).toEqual(player1.name)
  })

  it('should return the correct JSON representation', () => {
    const eventType = 'kill'
    const occurredAt = new Date()
    const killerPlayer = player1
    const victimPlayer = player2
    const isWorldEvent = false

    match.addMatchEvent(eventType, occurredAt, weapon, killerPlayer, victimPlayer, isWorldEvent)

    const json = match.toJSON()

    expect(json.id).toBe(match.id)
    expect(json.startedAt).toEqual(match.startedAt)
    expect(json.createdAt).toEqual(match.createdAt)
    expect(json.endedAt).toBeUndefined()
    expect(json.winningTeam).toBeUndefined()
    expect(json.winningPlayer).toBeUndefined()
    expect(json.matchEvents).toHaveLength(1)
    expect(json.playersOnMatches).toHaveLength(0)
  })
})
