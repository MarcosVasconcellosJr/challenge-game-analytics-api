import { createReadStream } from 'fs'
import * as readline from 'readline'

import { Injectable, Logger } from '@nestjs/common'
import { CreateMatchUseCase, CreateMatchUseCaseRequest } from '@/domain/use-cases/create-match'
import { EventRowType, LogLineParser } from '@/application/handlers/log-parser'
import { CacheRepository } from '@/infra/cache/cache-repository'
import { Weapon } from '@/domain/entities/weapon'
import { Player } from '@/domain/entities/player'
import { Team } from '@/domain/entities/team'
import { Match } from '@/domain/entities/match'

interface ReadFileResult {
  processedLines: number
  processedMatches: number
  lastMatchId: string | undefined
}

export interface ProcessingResult {
  startedTimestamp: Date
  endedTimestamp: Date
  totalMilliseconds: string
  fileResult: ReadFileResult
}

@Injectable()
export class LogFileHandler {
  private readonly logger = new Logger(LogFileHandler.name)

  private readonly batchSize = 10

  constructor(
    private createMatch: CreateMatchUseCase,
    private cache: CacheRepository,
    private logLineParser: LogLineParser
  ) {}

  public async parseLogFile(cloudFilePath: string, startLine = 0): Promise<ProcessingResult> {
    const startedTimestamp = new Date()

    const fileResult = await this.readFile(cloudFilePath, startLine)

    const endedTimestamp = new Date()

    const totalMilliseconds = `${endedTimestamp.getTime() - startedTimestamp.getTime()}ms`

    return {
      startedTimestamp,
      endedTimestamp,
      totalMilliseconds,
      fileResult,
    }
  }

  private async readFile(localDirectoryFilePath: string, startLine: number): Promise<ReadFileResult> {
    this.logger.debug(`Starting file read - path: ${localDirectoryFilePath}`)

    const fileStream = createReadStream(localDirectoryFilePath)
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    })

    rl.on('error', (err) => {
      this.logger.error('Error reading file', err)
    })

    let batchSizeCounter: number = 0
    let processedLines: number = 0
    let processedMatches: number = 0
    let lastMatchId: string | undefined
    let matches: CreateMatchUseCaseRequest[] = []
    let currentMatch!: CreateMatchUseCaseRequest | null

    for await (const line of rl) {
      processedLines++

      if (processedLines < startLine) continue // step over if processed already
      if (line === '') continue

      const result = this.logLineParser.parse(line)

      if (!result) {
        this.logger.error(`Line ${processedLines} is invalid [${line}]`)
        continue
      }

      switch (result.type) {
        case EventRowType.killEvent:
          if (!currentMatch) break
          if (!currentMatch.matchEvents) currentMatch.matchEvents = []

          currentMatch.addMatchEvent(
            'kill',
            result.timestamp,
            new Weapon(result.weapon),
            new Player(result.killer, new Team(result.killerTeam)),
            new Player(result.victim, new Team(result.victimTeam)),
            false
          )

          break

        case EventRowType.worldKill:
          continue

        case EventRowType.matchStart:
          currentMatch = new Match(result.timestamp, null, null, null, result.matchId.toString())
          break

        case EventRowType.matchEnd:
          if (!currentMatch) break

          currentMatch.endedAt = result.timestamp
          matches.push(currentMatch)
          currentMatch = null
          batchSizeCounter++

          break

        default:
          this.logger.error(`Line ${processedLines} has unidentified event pattern [${line}]`)
          break
      }

      if (batchSizeCounter >= this.batchSize) {
        if (matches.length > 0) {
          await this.processBatchMatches(matches)
          lastMatchId = matches[matches.length - 1].id?.toString()
          processedMatches += matches.length
          matches = []
        }

        batchSizeCounter = 0
      }
    }

    if (matches.length > 0) {
      await this.processBatchMatches(matches)
      lastMatchId = matches[matches.length - 1].id?.toString()
      processedMatches += matches.length
    }

    rl.close()
    fileStream.close()

    return {
      processedLines,
      processedMatches,
      lastMatchId,
    }
  }

  private async processBatchMatches(matches: CreateMatchUseCaseRequest[]) {
    this.logger.log(`Processing batch with ${matches.length} matches...`)

    try {
      await Promise.all(matches.map((match) => this.createMatch.execute(match)))
      await this.cache.set(`log_file_handler:last_match_processed`, matches[matches.length - 1].id)
    } catch (error) {
      this.logger.error(`Error processing matches identifiers: ${matches.join(',')}: ${error.message}`)
    }

    this.logger.log(`Batch processed!`)
  }
}
