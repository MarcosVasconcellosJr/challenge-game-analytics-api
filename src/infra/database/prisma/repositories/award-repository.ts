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

    const awardDb = await this.prisma.award.findFirst({ where: { title: data.title } })

    if (awardDb) return

    await this.prisma.award.create({
      data,
    })
  }
}
