import { PlayersOnMatchs } from '../entities/players-on-matchs'

export abstract class PlayersOnMatchsRepository {
  abstract save(playersOnMatchs: PlayersOnMatchs[]): Promise<void>
}
