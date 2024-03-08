import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ValidationPipe, VersioningType } from '@nestjs/common'
import fastifyHelmet from '@fastify/helmet'
import fastifyCookie from '@fastify/cookie'
import fastifyCsrfProtection from '@fastify/csrf-protection'
import fastifyMultipart from '@fastify/multipart'
import { TOKEN_KEY } from './shared/constants/common.constants'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  )

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      enableDebugMessages: true,
      transform: true,
    }),
  )

  await app.register(fastifyCsrfProtection, { cookieOpts: { signed: true } })

  app.register(fastifyMultipart, {
    logLevel: 'debug',
    limits: { fileSize: 10000000 }, // 10MBi
  })
  await app.register(fastifyHelmet)

  await app.register(fastifyCookie, {
    secret: process.env.COOKIE_SECRET,
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
    .addSecurity(TOKEN_KEY, { type: 'apiKey', in: 'header', name: TOKEN_KEY })
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
