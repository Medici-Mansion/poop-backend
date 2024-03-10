import { FastifyRequest, FastifyReply } from 'fastify'
import { NestMiddleware, Injectable } from '@nestjs/common'
import { ExternalsService } from '@/externals/externals.service'

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  constructor(private readonly externalsService: ExternalsService) {}

  use(
    req: FastifyRequest['raw'],
    res: FastifyReply['raw'],
    next: () => void,
  ): void {
    const start = Date.now()
    // @ts-ignore
    const { ip, method, originalUrl, hostname } = req
    const userAgent = req.headers['user-agent'] || ''
    res.on('finish', () => {
      const { statusCode } = res
      const contentLength = (res.getHeader('content-length') || '') as string
      const responseTime = Date.now() - start
      this.externalsService.logResponse({
        contentLength,
        ip,
        method,
        originalUrl,
        statusCode,
        userAgent,
        responseTime,
        hostname,
      })
    })

    next()
  }
}
