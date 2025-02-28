import { Injectable, Logger } from '@nestjs/common'
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { EnvService } from 'src/infra/env/env.service'
import { CloudStorageService, UploadParams } from '@/domain/application/storage/cloud-storage'

import * as fs from 'fs'
import * as path from 'path'
import * as os from 'os'
import { promisify } from 'util'
import { pipeline } from 'stream'

@Injectable()
export class AWSS3Service implements CloudStorageService {
  private readonly logger = new Logger(AWSS3Service.name)
  private readonly s3Client: S3Client

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

  async generatePreSignedUrl({
    fileKey,
    fileType = 'text/plain',
    expiresInSeconds = 3600,
  }: UploadParams): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.envService.get('AWS_S3_BUCKET_NAME'),
      Key: fileKey,
      ContentType: fileType,
    })

    try {
      const url = await getSignedUrl(this.s3Client, command, {
        expiresIn: expiresInSeconds,
      })

      return url
    } catch (error) {
      this.logger.error('Error creating preSigned URL for the file', {
        errorStack: error,
      })
      throw new Error('Error creating preSigned URL for the file from S3')
    }
  }

  async downloadFile(bucketName: string, fileKey: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: fileKey,
    })

    try {
      const data = await this.s3Client.send(command)

      if (!data.Body) {
        throw new Error('Empty file content')
      }

      const tempDir = os.tmpdir()
      const filePath = path.join(tempDir, fileKey)
      const writeStream = fs.createWriteStream(filePath)
      const streamPipeline = promisify(pipeline)

      await streamPipeline(data.Body as NodeJS.ReadableStream, writeStream)

      this.logger.log(`File downloaded to: ${filePath}`)
      return filePath
    } catch (error) {
      this.logger.log('Error downloading the file from S3', error)
      throw new Error('Error downloading the file from S3')
    }
  }
}
