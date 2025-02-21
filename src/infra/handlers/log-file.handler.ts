import { createReadStream } from 'fs'
import * as readline from 'readline'

import { Injectable, Logger } from '@nestjs/common'
import {
  CreateMatchUseCase,
  CreateMatchUseCaseRequest,
} from '@/domain/use-cases/create-match'
import { EventRowType, LogParser } from '@/application/services/log-parser'
import { CacheRepository } from '../cache/cache-repository'

interface ReadFileResult {
  processedLines: number
  processedMatchs: number
  lastMatchId: string | undefined
}

export interface ProcessingResult {
  startedTimestamp: Date
  endedTimestamp: Date
  totalMiliseconds: string
  fileResult: ReadFileResult
}

@Injectable()
export class LogFileHandler {
  private readonly logger = new Logger(LogFileHandler.name)

  private readonly batchSize = 1000

  constructor(
    private createMatch: CreateMatchUseCase,
    private cache: CacheRepository,
  ) {}

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
    this.logger.debug(`Starting file read - path: ${filePath}`)

    const fileStream = createReadStream(filePath)
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    })

    rl.on('error', (err) => {
      this.logger.error('Erro ao ler arquivo', err)
    })

    let batchSizeCounter: number = 0
    let processedLines: number = 0
    let processedMatchs: number = 0
    let lastMatchId: string | undefined
    let matches: CreateMatchUseCaseRequest[] = []
    let currentMatch!: CreateMatchUseCaseRequest | null

    for await (const line of rl) {
      processedLines++

      if (processedLines < startLine) continue // Pula linhas já processadas
      if (line === '') continue

      const result = LogParser.parseLine(line)

      if (!result) {
        this.logger.error(`Line ${processedLines} is invalid [${line}]`)
        continue
      }

      switch (result.type) {
        case EventRowType.killEvent:
          if (!currentMatch) break
          if (!currentMatch.events) currentMatch.events = []

          currentMatch.events?.push({
            ocurredAt: result.timestamp,
            eventType: 'kill',
            matchId: currentMatch.id,
            weapon: { name: result.weapon },
            killer: {
              name: result.killer,
              team: { name: result.killerTeam },
            },
            victim: {
              name: result.victim,
              team: { name: result.victimTeam },
            },
            isWorldEvent: false,
            isFriendlyFire: result.killerTeam === result.victimTeam,
          })

          break

        case EventRowType.worldKill:
          continue

        case EventRowType.matchStart:
          currentMatch = {
            id: result.matchId.toString(),
            startedAt: result.timestamp,
          }

          break

        case EventRowType.matchEnd:
          if (!currentMatch) break

          currentMatch.endedAt = result.timestamp
          matches.push(currentMatch)
          currentMatch = null
          batchSizeCounter++

          break

        default:
          this.logger.error(
            `Line ${processedLines} has unidentified event pattern [${line}]`,
          )
          break
      }

      if (batchSizeCounter >= this.batchSize) {
        if (matches.length > 0) {
          await this.processBatchMatchs(matches)
          lastMatchId = matches[matches.length - 1].id?.toString()
          processedMatchs += matches.length
          matches = []
        }

        batchSizeCounter = 0
      }
    }

    // process remaining
    if (matches.length > 0) {
      await this.processBatchMatchs(matches)
      lastMatchId = matches[matches.length - 1].id?.toString()
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

  private async processBatchMatchs(matches: CreateMatchUseCaseRequest[]) {
    this.logger.log(`Processing batch with ${matches.length} matches...`)

    for await (const match of matches) {
      try {
        await this.createMatch.execute(match)
      } catch (error) {
        await this.cache.set(`log_file_handler:last_match_processed`, match.id)
        break
      }
    }

    this.logger.log(`Batch processed!`)
  }
}
