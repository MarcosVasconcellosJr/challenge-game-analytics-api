import { Module } from '@nestjs/common'
import { EnvModule } from 'src/infra/env/env.module'
import { CacheRepository } from 'src/infra/cache/cache-repository'
import { RedisCacheRepository } from 'src/infra/cache/redis/redis-cache-repository'
import { RedisService } from 'src/infra/cache/redis/redis.service'

@Module({
  imports: [EnvModule],
  providers: [
    RedisService,
    {
      provide: CacheRepository,
      useClass: RedisCacheRepository,
    },
  ],
  exports: [CacheRepository],
})
export class CacheModule {}
