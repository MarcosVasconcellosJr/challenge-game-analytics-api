import { Injectable, Logger } from '@nestjs/common'
import { Consumer, ConsumerOptions } from 'sqs-consumer'
import { SQSClient } from '@aws-sdk/client-sqs'
import { EnvService } from '@/infra/env/env.service'

@Injectable()
export class SqsConsumerService {
  private readonly logger = new Logger(SqsConsumerService.name)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private consumers: any[] = []

  constructor(private readonly envService: EnvService) {}

  registerQueue({ queueUrl, handleMessage }: ConsumerOptions) {
    const app = Consumer.create({
      queueUrl,
      handleMessage,
      sqs: new SQSClient({
        region: this.envService.get('AWS_SQS_REGION'),
        credentials: {
          accessKeyId: this.envService.get('AWS_ACCESS_KEY_ID'),
          secretAccessKey: this.envService.get('AWS_SECRET_ACCESS_KEY'),
        },
        endpoint: this.envService.get('AWS_ENDPOINT'),
      }),
    })

    app.on('error', (err) => {
      this.logger.error(`Erro na fila ${queueUrl}`, err)
    })

    app.on('processing_error', (err) => {
      this.logger.error(
        `Erro ao processar a mensagem na fila ${queueUrl}: ${err.message}`,
      )
    })

    app.on('timeout_error', (err) => {
      this.logger.error(`Erro de timeout na fila ${queueUrl}: ${err.message}`)
    })

    this.consumers.push(app)
  }

  startConsumers() {
    this.consumers.forEach((consumer) => {
      consumer.start()
      this.logger.log('Iniciando consumidor para fila')
    })
  }

  stopConsumers() {
    this.consumers.forEach((consumer) => {
      consumer.stop()
      this.logger.log('Parando consumidor para fila')
    })
  }
}
