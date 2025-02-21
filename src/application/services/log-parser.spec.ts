import { describe, it, expect } from 'vitest'
import { LogParser, EventRowType } from './log-parser' // Ajuste o caminho conforme necessário
import { parse } from 'date-fns'

describe('LogParser', () => {
  it('should parse a kill event correctly', () => {
    const line =
      '12/02/2024 14:23:45 - Player1(TeamA) killed Player2(TeamB) using AK47'
    const result = LogParser.parseLine(line)

    expect(result).toEqual({
      type: EventRowType.killEvent,
      timestamp: parse(
        '12/02/2024 14:23:45',
        'dd/MM/yyyy HH:mm:ss',
        new Date(),
      ),
      killer: 'Player1',
      killerTeam: 'TeamA',
      victim: 'Player2',
      victimTeam: 'TeamB',
      weapon: 'AK47',
    })
  })

  it('should parse a world kill event correctly', () => {
    const line = '12/02/2024 14:23:45 - <WORLD> killed Player3(TeamC) by DROWN'
    const result = LogParser.parseLine(line)

    expect(result).toEqual({
      type: EventRowType.worldKill,
      timestamp: parse(
        '12/02/2024 14:23:45',
        'dd/MM/yyyy HH:mm:ss',
        new Date(),
      ),
      victim: 'Player3',
      victimTeam: 'TeamC',
      cause: 'DROWN',
    })
  })

  it('should parse a match start event correctly', () => {
    const line = '12/02/2024 14:23:45 - New match 123 has started'
    const result = LogParser.parseLine(line)

    expect(result).toEqual({
      type: EventRowType.matchStart,
      timestamp: parse(
        '12/02/2024 14:23:45',
        'dd/MM/yyyy HH:mm:ss',
        new Date(),
      ),
      matchId: 123,
    })
  })

  it('should parse a match end event correctly', () => {
    const line = '12/02/2024 14:23:45 - Match 123 has ended'
    const result = LogParser.parseLine(line)

    expect(result).toEqual({
      type: EventRowType.matchEnd,
      timestamp: parse(
        '12/02/2024 14:23:45',
        'dd/MM/yyyy HH:mm:ss',
        new Date(),
      ),
      matchId: 123,
    })
  })

  it('should return null for an invalid log line', () => {
    const line = '12/02/2024 14:23:45 - Unknown event happened'
    const result = LogParser.parseLine(line)

    expect(result).toBeNull()
  })

  it('should return null for a completely malformed line', () => {
    const line = 'Invalid log line without timestamp'
    const result = LogParser.parseLine(line)

    expect(result).toBeNull()
  })
})
