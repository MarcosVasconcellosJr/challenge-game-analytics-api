import { Injectable, Logger } from '@nestjs/common'
import { Consumer, ConsumerOptions } from 'sqs-consumer'
import { SQSClient } from '@aws-sdk/client-sqs'
import { EnvService } from '@/infra/env/env.service'

@Injectable()
export class SqsConsumerService {
  private readonly logger = new Logger(SqsConsumerService.name)

  private consumers: Consumer[] = []

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
        maxAttempts: 3,
        retryMode: 'adaptive',
      }),
    })

    app.on('error', (err) => {
      this.logger.error(`Queue error: ${queueUrl}`, err)
    })

    app.on('processing_error', (err) => {
      this.logger.error(`Error processing message on queue: ${queueUrl}: ${err.message}`, {
        queueUrl,
        errorMessage: err.message,
      })
    })

    app.on('timeout_error', (err) => {
      this.logger.error(`Timeout error on queue ${queueUrl}: ${err.message}`, {
        queueUrl,
        errorMessage: err.message,
      })
    })

    this.consumers.push(app)
  }

  startConsumers() {
    this.logger.debug('Starting consumers')

    this.consumers.forEach((consumer, index) => {
      consumer.start()
      this.logger.debug(`Consumer ${index + 1} started`)
    })
  }

  stopConsumers() {
    this.logger.debug('Stopping consumers')

    this.consumers.forEach((consumer, index) => {
      consumer.stop()
      this.logger.debug(`Consumer ${index + 1} stopped`)
    })
  }
}
