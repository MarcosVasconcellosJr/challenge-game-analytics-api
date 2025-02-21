import { Award } from 'src/domain/entities/award'

export abstract class AwardRepository {
  abstract save(award: Award): Promise<void>
}
