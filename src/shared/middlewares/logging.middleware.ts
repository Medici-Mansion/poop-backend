import { FastifyRequest, FastifyReply } from 'fastify'
import { NestMiddleware, Injectable, Logger } from '@nestjs/common'
import { ExternalsService } from '@/externals/externals.service'

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP')
  constructor(private readonly externalsService: ExternalsService) {}

  use(
    req: FastifyRequest['raw'],
    res: FastifyReply['raw'],
    next: () => void,
  ): void {
    const start = Date.now()
    // @ts-expect-error - FastifyRequest 'raw' type lacks properties used here
    const { ip, method, originalUrl, hostname } = req
    const userAgent = req.headers['user-agent'] || ''
    res.on('finish', () => {
      try {
        const { statusCode } = res
        const contentLength = (res.getHeader('content-length') || '') as string
        const responseTime = Date.now() - start
        this.logger.log(
          `${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip}`,
        )
        this.externalsService.logResponse({
          contentLength,
          ip,
          method: method ?? '',
          originalUrl,
          statusCode,
          userAgent,
          responseTime,
          hostname,
        })
      } catch (err) {
        console.log(`[LOG ERROR]: ${err}`)
      }
    })

    next()
  }
}
