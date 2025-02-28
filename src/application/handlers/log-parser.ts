import { Injectable, Logger } from '@nestjs/common'
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

@Injectable()
export class LogLineParser {
  private readonly logger = new Logger(LogLineParser.name)

  constructor() {}

  public parse(line: string): EventData | null {
    const { timestamp, eventData } = this.extractTimestampAndEventData(line)
    if (!timestamp || !eventData) {
      this.logger.log(`Failed to parse line: ${line}`)
      return null
    }

    const event = this.parseEventData(eventData, timestamp)
    if (!event) {
      this.logger.log(`Unknown event type for line: ${line}`)
    }

    return event
  }

  private extractTimestampAndEventData(line: string): {
    timestamp: Date | null
    eventData: string | null
  } {
    const match = line.match(/(\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}) - (.*)/)
    if (!match) return { timestamp: null, eventData: null }

    const timestamp = parse(match[1], 'dd/MM/yyyy HH:mm:ss', new Date())
    const eventData = match[2]

    return { timestamp, eventData }
  }

  private parseEventData(eventData: string, timestamp: Date): EventData | null {
    const killEvent = this.parseKillEvent(eventData, timestamp)
    if (killEvent) return killEvent

    const worldKillEvent = this.parseWorldKillEvent(eventData, timestamp)
    if (worldKillEvent) return worldKillEvent

    const matchStartEvent = this.parseMatchStartEvent(eventData, timestamp)
    if (matchStartEvent) return matchStartEvent

    const matchEndEvent = this.parseMatchEndEvent(eventData, timestamp)
    if (matchEndEvent) return matchEndEvent

    return null
  }

  private parseKillEvent(eventData: string, timestamp: Date): KillEvent | null {
    const killMatch = eventData.match(/(\w+)\((\w+)\) killed (\w+)\((\w+)\) using (\w+)/)
    if (!killMatch) return null

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

  private parseWorldKillEvent(eventData: string, timestamp: Date): WorldKillEvent | null {
    if (!eventData.startsWith('<WORLD>')) return null

    const worldKillMatch = eventData.match(/<WORLD> killed (\w+)\((\w+)\) by (\w+)/)

    if (!worldKillMatch) return null

    return {
      type: EventRowType.worldKill,
      timestamp,
      victim: worldKillMatch[1],
      victimTeam: worldKillMatch[2],
      cause: worldKillMatch[3],
    }
  }

  private parseMatchStartEvent(eventData: string, timestamp: Date): MatchStartEvent | null {
    if (!eventData.startsWith('New match')) return null

    const matchId = parseInt(eventData.match(/New match (\d+) has started/)?.[1] || '', 10)

    return { type: EventRowType.matchStart, timestamp, matchId }
  }

  private parseMatchEndEvent(eventData: string, timestamp: Date): MatchEndEvent | null {
    if (!eventData.startsWith('Match')) return null

    const matchId = parseInt(eventData.match(/Match (\d+) has ended/)?.[1] || '', 10)
    return { type: EventRowType.matchEnd, timestamp, matchId }
  }
}
