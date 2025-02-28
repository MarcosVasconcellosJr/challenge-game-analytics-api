import { Injectable } from '@nestjs/common'
import { CacheRepository } from 'src/infra/cache/cache-repository'
import { RedisService } from './redis.service'

@Injectable()
export class RedisCacheRepository implements CacheRepository {
  constructor(private redis: RedisService) {}

  async set(key: string, value: string): Promise<void> {
    await this.redis.set(key, value, 'EX', 60 * 15)
  }

  async setWithExpiration(key: string, value: string, expirationInSeconds: number = 60 * 15): Promise<void> {
    await this.redis.set(key, value, 'EX', expirationInSeconds)
  }

  get(key: string): Promise<string | null> {
    return this.redis.get(key)
  }

  async delete(key: string): Promise<void> {
    await this.redis.del(key)
  }
}
