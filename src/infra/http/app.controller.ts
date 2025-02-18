import { Controller, Get, Logger } from '@nestjs/common'

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name)

  @Get()
  getHello(): string {
    this.logger.log('Executando uma ação no serviço')
    this.logger.warn('Aviso sobre algo relevante')
    this.logger.error('Erro ao executar a ação', { error: 'Detalhes do erro' })

    return 'Hello World!'
  }
}
