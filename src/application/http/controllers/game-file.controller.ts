import {
  LogParserService,
  ProcessingResult,
} from 'src/infra/service/log-parser.service'
import { Uploader } from '@/domain/application/storage/uploader'
import {
  Controller,
  Get,
  Query,
  Logger,
  UseInterceptors,
  Post,
  UploadedFile,
} from '@nestjs/common'

import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { unlink } from 'fs/promises'

@Controller({ path: 'game-file', version: '1' })
export class GameFileController {
  private readonly logger = new Logger(GameFileController.name)

  constructor(
    private readonly uploader: Uploader,
    private readonly logParserService: LogParserService,
  ) {}

  @Get('/presigned-url')
  async getPresignedUrl(@Query('fileKey') fileKey: string) {
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
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ProcessingResult> {
    if (!file) {
      throw new Error('Nenhum arquivo enviado.')
    }

    this.logger.debug(`Arquivo salvo em: ${file.path}`)

    // Process file - line by line
    const fileParseResult = await this.logParserService.parseLogFile(file.path)

    // Remove file after full read
    await unlink(file.path).catch((err) =>
      this.logger.error(
        'Erro ao remover o arquivo temporário após a leitura',
        err,
      ),
    )

    this.logger.debug(`Arquivo removido após processamento: ${file.path}`)

    return fileParseResult
  }
}
