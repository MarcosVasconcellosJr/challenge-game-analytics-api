import { Logger, Module, OnModuleInit } from '@nestjs/common'
import { SqsConsumerService } from './queue-consumer.service'
import { EnvService } from '@/infra/env/env.service'
import { S3Event } from './types/file-event-message'
import { LogFileHandler } from '@/application/handlers/log-file.handler'
import { CloudStorageService } from '@/domain/application/storage/cloud-storage'
import { HandlersModule } from '@/application/handlers/handlers.module'
import { CloudStorageModule } from '@/infra/cloud-storage/cloud-storage.module'

@Module({
  imports: [HandlersModule, CloudStorageModule],
  providers: [SqsConsumerService, EnvService],
  exports: [SqsConsumerService],
})
export class QueueConsumerModule implements OnModuleInit {
  private readonly logger = new Logger(QueueConsumerModule.name)

  constructor(
    private readonly sqsConsumerService: SqsConsumerService,
    private readonly envService: EnvService,
    private readonly logFileHandler: LogFileHandler,
    private readonly cloudStorageService: CloudStorageService
  ) {}

  onModuleInit() {
    const queueUrlFile = this.envService.get('AWS_SQS_QUEUE_URL_FILE')

    this.sqsConsumerService.registerQueue({
      queueUrl: queueUrlFile,
      handleMessage: async (message) => {
        this.logger.debug(`Message received on queue: ${queueUrlFile}`, {
          queueUrl: queueUrlFile,
          body: message.Body,
        })

        const messageBody: S3Event = JSON.parse(String(message.Body))

        if (messageBody?.Event?.includes('s3:TestEvent')) {
          return message
        }

        const cloudFilePath = messageBody.Records[0].s3.object.key

        const localFilePath = await this.cloudStorageService.downloadFile(
          this.envService.get('AWS_S3_BUCKET_NAME'),
          cloudFilePath
        )

        const logFileParseResult = await this.logFileHandler.parseLogFile(localFilePath)

        this.logger.log(`Log file parsed`, logFileParseResult)

        return message
      },
    })

    if (this.envService.get('FEATURE_FLAG_CONSUMERS_ENABLED')) {
      this.sqsConsumerService.startConsumers()
    }
  }
}
