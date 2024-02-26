import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
import fastifyHelmet from '@fastify/helmet'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
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

  app.enableCors({
    credentials: true,
    origin: '*',
  })
  await app.listen(3000, '0.0.0.0')
}
bootstrap()
