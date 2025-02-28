import { Team as PrismaTeam, Prisma } from '@prisma/client'
import { Team } from '@/domain/entities/team'

export class PrismaTeamMapper {
  static toDomain(raw: PrismaTeam): Team {
    return new Team(raw.name, raw.id)
  }

  static toPrisma(team: Team): Prisma.TeamUncheckedCreateInput {
    return {
      name: team.name,
    }
  }
}
