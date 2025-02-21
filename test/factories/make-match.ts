import { faker } from '@faker-js/faker'

import { Match, MatchProps } from '@/domain/entities/match'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaMatchMapper } from '@/infra/database/prisma/mappers/prisma-match-mapper'
import { Injectable } from '@nestjs/common'
import { randomUUID } from 'node:crypto'

export function makeMatch(override: Partial<MatchProps> = {}) {
  const match = Match.create({
    startedAt: faker.date.anytime(),
    endedAt: faker.date.anytime(),
    winningPlayerId: randomUUID(),
    winningTeamId: randomUUID(),
    ...override,
  })

  return match
}

@Injectable()
export class MatchFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaMatch(data: Partial<MatchProps> = {}): Promise<Match> {
    const match = makeMatch(data)

    await this.prisma.match.create({
      data: PrismaMatchMapper.toPrisma(match),
    })

    return match
  }
}
