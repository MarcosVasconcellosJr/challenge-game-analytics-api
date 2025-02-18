import { Module, OnModuleInit } from '@nestjs/common'
import { SqsConsumerService } from './queue-consumer.service'
import { EnvService } from '@/infra/env/env.service'

@Module({
  providers: [SqsConsumerService, EnvService],
  exports: [SqsConsumerService],
})
export class QueueConsumerModule implements OnModuleInit {
  constructor(
    private readonly sqsConsumerService: SqsConsumerService,
    private readonly envService: EnvService,
  ) {}

  onModuleInit() {
    this.sqsConsumerService.registerQueue({
      queueUrl: this.envService.get('AWS_SQS_QUEUE_URL_FILE'),
      handleMessage: async (message) => {
        console.log('Mensagem recebida da fila FILE:', message)
        return message
      },
    })

    this.sqsConsumerService.registerQueue({
      queueUrl: this.envService.get('AWS_SQS_QUEUE_URL_MATCH'),
      handleMessage: async (message) => {
        console.log('Mensagem recebida da fila MATCH:', message)
        return message
      },
    })

    this.sqsConsumerService.startConsumers()
  }
}
