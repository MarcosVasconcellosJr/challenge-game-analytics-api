import { NestFactory } from '@nestjs/core'
import { AppModule } from 'src/infra/app.module'
import { EnvService } from 'src/infra/env/env.service'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  })

  const config = new DocumentBuilder()
    .setTitle('Game Analytics')
    .setDescription('The Game Analytics API description')
    .setVersion('1.0')
    .addTag('game')
    .build()
  const documentFactory = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('swagger', app, documentFactory)

  const configService = app.get(EnvService)
  const port = configService.get('PORT')

  await app.listen(port)
}

bootstrap()
