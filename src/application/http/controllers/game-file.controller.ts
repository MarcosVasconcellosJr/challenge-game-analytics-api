import { LogFileHandler, ProcessingResult } from '@/infra/handlers/log-file.handler'
import { Uploader } from '@/domain/application/storage/uploader'
import { Controller, Get, Query, Logger, UseInterceptors, Post, UploadedFile } from '@nestjs/common'

import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { unlink } from 'fs/promises'

@Controller({ path: 'game-file', version: '1' })
export class GameFileController {
  private readonly logger = new Logger(GameFileController.name)

  constructor(
    private readonly uploader: Uploader,
    private readonly logFileHandler: LogFileHandler
  ) {}

  @Get('/pre-signed-url')
  async getPreSignedUrl(@Query('fileKey') fileKey: string) {
    const url = await this.uploader.generatePresignedUrl({
      fileKey,
    })

    return { url }
  }

  @Post('/upload')
  @UseInterceptors(
    FileInterceptor('game-file', {
      storage: diskStorage({
        destination: './data/tmp/files', // temp folder
        filename: (req, file, callback) => {
          const uniqueName = `${Date.now()}-${file.originalname}`
          callback(null, uniqueName)
        },
      }),
    })
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<ProcessingResult> {
    if (!file) {
      throw new Error('No files sent.')
    }

    this.logger.debug(`File saved temporarily in filepath: ${file.path}`)

    const fileParseResult = await this.logFileHandler.parseLogFile(file.path)

    await unlink(file.path).catch((err) => this.logger.error('Error removing temporary file after reading', err))

    this.logger.debug(`File removed after processing: ${file.path}`)

    return fileParseResult
  }
}
