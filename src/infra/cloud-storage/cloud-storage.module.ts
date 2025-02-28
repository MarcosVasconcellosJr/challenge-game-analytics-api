import { Module } from '@nestjs/common'
import { AWSS3Service } from './aws-s3.service'
import { EnvModule } from 'src/infra/env/env.module'
import { CloudStorageService } from '@/domain/application/storage/cloud-storage'

@Module({
  imports: [EnvModule],
  providers: [
    {
      provide: CloudStorageService,
      useClass: AWSS3Service,
    },
  ],
  exports: [CloudStorageService],
})
export class CloudStorageModule {}
