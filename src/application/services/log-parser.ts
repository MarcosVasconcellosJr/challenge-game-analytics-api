import { parse } from 'date-fns'

export enum EventRowType {
  matchStart = 'matchStart',
  matchEnd = 'matchEnd',
  killEvent = 'killEvent',
  worldKill = 'worldKill',
}

type MatchStartEvent = {
  type: EventRowType.matchStart
  timestamp: Date
  matchId: number
}

type MatchEndEvent = {
  type: EventRowType.matchEnd
  timestamp: Date
  matchId: number
}

type KillEvent = {
  type: EventRowType.killEvent
  timestamp: Date
  killer: string
  killerTeam: string
  victim: string
  victimTeam: string
  weapon: string
}

type WorldKillEvent = {
  type: EventRowType.worldKill
  timestamp: Date
  victim: string
  victimTeam: string
  cause: string
}

type EventData = MatchStartEvent | MatchEndEvent | KillEvent | WorldKillEvent

export class LogParser {
  static parseLine(line: string): EventData | null {
    const match = line.match(/(\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}) - (.*)/)
    if (!match) return null

    const timestamp = parse(match[1], 'dd/MM/yyyy HH:mm:ss', new Date())
    const eventData = match[2]

    // most common
    const killMatch = eventData.match(
      /(\w+)\((\w+)\) killed (\w+)\((\w+)\) using (\w+)/,
    )
    if (killMatch) {
      return {
        type: EventRowType.killEvent,
        timestamp,
        killer: killMatch[1],
        killerTeam: killMatch[2],
        victim: killMatch[3],
        victimTeam: killMatch[4],
        weapon: killMatch[5],
      }
    }

    if (eventData.startsWith('<WORLD>')) {
      const worldKillMatch = eventData.match(
        /<WORLD> killed (\w+)\((\w+)\) by (\w+)/,
      )
      if (worldKillMatch) {
        return {
          type: EventRowType.worldKill,
          timestamp,
          victim: worldKillMatch[1],
          victimTeam: worldKillMatch[2],
          cause: worldKillMatch[3],
        }
      }
    }

    if (eventData.startsWith('New match')) {
      const matchId = parseInt(
        eventData.match(/New match (\d+) has started/)?.[1] || '',
        10,
      )
      return { type: EventRowType.matchStart, timestamp, matchId }
    }

    if (eventData.startsWith('Match')) {
      const matchId = parseInt(
        eventData.match(/Match (\d+) has ended/)?.[1] || '',
        10,
      )
      return { type: EventRowType.matchEnd, timestamp, matchId }
    }

    return null
  }
}
