import { Injectable } from '@nestjs/common'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { EnvService } from 'src/infra/env/env.service'
import {
  Uploader,
  UploadParams,
} from '@/domain/match/application/storage/uploader'

@Injectable()
export class AWSS3Service implements Uploader {
  private s3Client: S3Client

  constructor(private readonly envService: EnvService) {
    this.s3Client = new S3Client({
      region: this.envService.get('AWS_S3_REGION'),
      endpoint: this.envService.get('AWS_ENDPOINT'),
      credentials: {
        accessKeyId: this.envService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.envService.get('AWS_SECRET_ACCESS_KEY'),
      },
      forcePathStyle: true,
    })
  }

  async generatePresignedUrl({
    fileKey,
    fileType = 'text/plain',
    expiresInSeconds = 3600,
  }: UploadParams): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.envService.get('AWS_S3_BUCKET_NAME'),
      Key: fileKey,
      ContentType: fileType,
    })

    const url = await getSignedUrl(this.s3Client, command, {
      expiresIn: expiresInSeconds,
    })

    return url
  }
}
