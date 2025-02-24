import { Logger, Module, OnModuleInit } from '@nestjs/common'
import { SqsConsumerService } from './queue-consumer.service'
import { EnvService } from '@/infra/env/env.service'

@Module({
  providers: [SqsConsumerService, EnvService],
  exports: [SqsConsumerService],
})
export class QueueConsumerModule implements OnModuleInit {
  private readonly logger = new Logger(QueueConsumerModule.name)

  constructor(
    private readonly sqsConsumerService: SqsConsumerService,
    private readonly envService: EnvService
  ) {}

  onModuleInit() {
    this.sqsConsumerService.registerQueue({
      queueUrl: this.envService.get('AWS_SQS_QUEUE_URL_FILE'),
      handleMessage: async (message) => {
        this.logger.debug('Mensagem recebida da fila FILE:', {
          body: message.Body,
        })
        return message
      },
    })

    this.sqsConsumerService.registerQueue({
      queueUrl: this.envService.get('AWS_SQS_QUEUE_URL_MATCH'),
      handleMessage: async (message) => {
        this.logger.debug('Mensagem recebida da fila MATCH {body}', {
          body: message.Body,
        })
        return message
      },
    })

    if (this.envService.get('FEATURE_FLAG_CONSUMERS_ENABLED')) {
      this.sqsConsumerService.startConsumers()
    }
  }
}
