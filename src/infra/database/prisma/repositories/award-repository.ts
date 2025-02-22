import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { AwardRepository } from '@/domain/repositories/award-repository'
import { Award } from '@/domain/entities/award'
import { PrismaAwardMapper } from '../mappers/prisma-award-mapper'

@Injectable()
export class PrismaAwardRepository implements AwardRepository {
  constructor(private prisma: PrismaService) {}

  async save(award: Award): Promise<void> {
    const data = PrismaAwardMapper.toPrisma(award)

    await this.prisma.award.create({
      data,
    })
  }
}
