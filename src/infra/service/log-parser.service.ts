import { createReadStream } from 'fs'
import { Injectable } from '@nestjs/common'
import * as readline from 'readline'

interface MatchEvent {
  event: string
  weapon?: string
  killType?: string
  timestamp: string
  sourcePlayer?: {
    name: string
    team?: string
  }
  targetPlayer: {
    name: string
    team?: string
  }
}

interface MatchData {
  matchId: number
  matchStartedTimestamp: string
  matchEndedTimestamp: string
  matchEvents: MatchEvent[]
}

interface ReadFileResult {
  processedLines: number
  processedMatchs: number
  lastMatchId: number
}

export interface ProcessingResult {
  startedTimestamp: Date
  endedTimestamp: Date
  totalMiliseconds: string
  fileResult: ReadFileResult
}

@Injectable()
export class LogParserService {
  private readonly matchStartRegex =
    /(\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}) - New match (\d+) has started/

  private readonly matchEndRegex =
    /(\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}) - Match (\d+) has ended/

  private readonly killEventRegex =
    /(\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}) - (\w+)\((\w+)\) killed (\w+)\((\w+)\) using (\w+)/

  private readonly worldKillRegex =
    /(\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}) - <WORLD> killed (\w+)\((\w+)\) by (\w+)/

  private readonly batchSize = 1000

  public async parseLogFile(
    filePath: string,
    startLine = 0,
  ): Promise<ProcessingResult> {
    const startedTimestamp = new Date()

    const fileResult = await this.readFile(filePath, startLine)

    const endedTimestamp = new Date()

    return {
      startedTimestamp,
      endedTimestamp,
      totalMiliseconds: `${endedTimestamp.getTime() - startedTimestamp.getTime()}ms`,
      fileResult,
    }
  }

  private async readFile(
    filePath: string,
    startLine: number,
  ): Promise<ReadFileResult> {
    const fileStream = createReadStream(filePath)
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    })

    rl.on('error', (err) => {
      console.error('Erro ao ler arquivo', err)
    })

    let batchSizeCounter: number = 0
    let processedLines: number = 0
    let processedMatchs: number = 0
    let lastMatchId: number = 0
    let currentMatch: MatchData | null = null
    let matches: MatchData[] = []

    for await (const line of rl) {
      processedLines++

      if (processedLines < startLine) continue // Pula linhas já processadas

      if (this.matchEndRegex.test(line) && currentMatch) {
        const matchEnd = line.match(this.matchEndRegex)
        currentMatch.matchEndedTimestamp = matchEnd![1]
        matches.push(currentMatch)
        currentMatch = null
        batchSizeCounter++
      } else if (this.matchStartRegex.test(line)) {
        const matchStart = line.match(this.matchStartRegex)
        if (currentMatch) matches.push(currentMatch)
        currentMatch = {
          matchId: parseInt(matchStart![2]),
          matchStartedTimestamp: matchStart![1],
          matchEndedTimestamp: '',
          matchEvents: [],
        }
      } else if (this.killEventRegex.test(line) && currentMatch) {
        const killEvent = line.match(this.killEventRegex)
        currentMatch.matchEvents.push({
          event: 'killed',
          killType: 'weapon',
          weapon: killEvent![6],
          timestamp: killEvent![1],
          sourcePlayer: { name: killEvent![2], team: killEvent![3] },
          targetPlayer: { name: killEvent![4], team: killEvent![5] },
        })
      } else if (this.worldKillRegex.test(line) && currentMatch) {
        const worldKill = line.match(this.worldKillRegex)
        currentMatch.matchEvents.push({
          event: 'killed',
          killType: 'map',
          weapon: worldKill![4],
          timestamp: worldKill![1],
          targetPlayer: { name: worldKill![2], team: worldKill![3] },
        })
      }

      if (batchSizeCounter >= this.batchSize) {
        if (matches.length > 0) {
          await this.processBatch(matches)
          lastMatchId = matches[matches.length - 1].matchId
          processedMatchs += matches.length
          matches = []
        }

        batchSizeCounter = 0
      }
    }

    // processa sobras?
    if (matches.length > 0) {
      await this.processBatch(matches)
      lastMatchId = matches[matches.length - 1].matchId
      processedMatchs += matches.length
      matches = []
    }

    // flush stream
    rl.close()
    fileStream.close()

    return {
      processedLines,
      processedMatchs,
      lastMatchId,
    }
  }

  private async processBatch(matches: MatchData[]) {
    console.log(`Processing batch with ${matches.length} matches...`)

    // Simule o processamento
    await new Promise((resolve) => setTimeout(resolve, 5000))

    console.log(`Batch processed!`)
  }
}
