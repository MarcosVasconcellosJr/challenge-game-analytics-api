import { EnvService } from '@/infra/env/env.service'
import { Controller, Get } from '@nestjs/common'

interface HelloWorldResponse {
  message: string
  environment: string
}

@Controller()
export class AppController {
  constructor(private readonly envService: EnvService) {}

  @Get()
  getHello(): HelloWorldResponse {
    return {
      message: 'Hello World!',
      environment: this.envService.get('ENV'),
    }
  }
}
