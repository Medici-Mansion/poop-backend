import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
import fastifyHelmet from '@fastify/helmet'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { VersioningType } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  )

  await app.register(fastifyHelmet, {
    contentSecurityPolicy: {
      directives: {
        'apollo-require-preflight': 'true',
        defaultSrc: [`'self'`, 'unpkg.com'],
        styleSrc: [
          `'self'`,
          `'unsafe-inline'`,
          'cdn.jsdelivr.net',
          'fonts.googleapis.com',
          'unpkg.com',
        ],
        fontSrc: [`'self'`, 'fonts.gstatic.com', 'data:'],
        imgSrc: [`'self'`, 'data:', 'cdn.jsdelivr.net'],
        scriptSrc: [
          `'self'`,
          `https: 'unsafe-inline'`,
          `cdn.jsdelivr.net`,
          `'unsafe-eval'`,
        ],
      },
    },
  })

  app
    .enableVersioning({
      type: VersioningType.URI,
      prefix: 'v',
      defaultVersion: '1',
    })
    .setGlobalPrefix('api')

  const config = new DocumentBuilder()
    .setTitle('POOP API')
    .setDescription('POOP API 문서입니다.')
    .setVersion('0.0.1')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('/api-docs', app, document)

  app.enableCors({
    credentials: true,
    origin: '*',
  })
  await app.listen(3000, '0.0.0.0')
}
bootstrap()
