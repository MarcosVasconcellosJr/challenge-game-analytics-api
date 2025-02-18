import { Uploader } from '@/domain/match/application/storage/uploader'
import { Controller, Get, Query, Logger } from '@nestjs/common'

@Controller({ path: 'upload', version: '1' })
export class UploadController {
  private readonly logger = new Logger(UploadController.name)

  constructor(private readonly uploader: Uploader) {}

  @Get('/presigned-url')
  async getPresignedUrl(@Query('fileKey') fileKey: string) {
    this.logger.log('GET /upload/presigned-url')

    const url = await this.uploader.generatePresignedUrl({
      fileKey,
    })

    return { url }
  }
}
