import { EnvService } from '@/infra/env/env.service'
import { Controller, Get, Logger } from '@nestjs/common'

interface HelloWorldResponse {
  message: string
  environment: string
}

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name)

  constructor(private readonly envService: EnvService) {}

  @Get()
  getHello(): HelloWorldResponse {
    this.logger.log('Hello world called')

    return {
      message: 'Hello World!',
      environment: this.envService.get('ENV'),
    }
  }
}
