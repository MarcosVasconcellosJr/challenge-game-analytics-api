import { faker } from '@faker-js/faker'
import { Match } from '@/domain/entities/match'
import { randomUUID } from 'node:crypto'
import { MatchEvent } from '@/domain/entities/match-event'
import { Weapon } from '@/domain/entities/weapon'
import { Player } from '@/domain/entities/player'
import { Team } from '@/domain/entities/team'

export function makeMatch(id: string) {
  return new Match(
    new Date(),
    new Date(),
    [
      new MatchEvent(
        randomUUID(),
        'kill',
        faker.date.anytime(),
        new Weapon('AK47'),
        new Player('LUKE', new Team('Spartan')),
        new Player('GOLDEN', new Team('Grifnorhia')),
        false,
        randomUUID()
      ),
      new MatchEvent(
        randomUUID(),
        'kill',
        faker.date.anytime(),
        new Weapon('M16'),
        new Player('KAGE', new Team('Spartan')),
        new Player('FLYN', new Team('Grifnorhia')),
        false,
        randomUUID()
      ),
    ],
    null,
    id
  )
}
