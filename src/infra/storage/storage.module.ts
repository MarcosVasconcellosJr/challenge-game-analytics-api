import { Module } from '@nestjs/common'
import { AWSS3Service } from './aws-s3.service'
import { EnvModule } from 'src/infra/env/env.module'
import { Uploader } from '@/domain/match/application/storage/uploader'

@Module({
  imports: [EnvModule],
  providers: [
    {
      provide: Uploader,
      useClass: AWSS3Service,
    },
  ],
  exports: [Uploader],
})
export class StorageModule {}
