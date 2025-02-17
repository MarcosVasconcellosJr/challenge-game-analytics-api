import { NestFactory } from '@nestjs/core'
import { AppModule } from 'src/infra/app.module'
import { EnvService } from 'src/infra/env/env.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {})

  const configService = app.get(EnvService)
  const port = configService.get('PORT')

  await app.listen(port)
}
bootstrap()
