import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { FastifyReply, FastifyRequest } from 'fastify'
import { Api } from '@/shared/dtos/api.dto'
import { ResultCode } from '@/shared/errors/dtos/resultCode.dto'
import { ExternalsService } from '@/externals/externals.service'

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly externalsService: ExternalsService) {}
  private logger = new Logger(GlobalExceptionFilter.name)

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<FastifyReply>()

    const { ip, method, originalUrl, hostname, protocol } =
      ctx.getRequest<FastifyRequest>()

    this.logger.fatal(`[INCOMING]: ${method} ${originalUrl} ${hostname} ${ip}`)

    this.logger.fatal(`[GLOBAL FILTER LOG]: ${exception}`)
    this.logger.fatal({ exception })

    this.externalsService.fatalResponse({
      ip,
      method: method ?? '',
      originalUrl,
      hostname,
      protocol,
    })

    response
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .send(Api.ERROR(new ResultCode(500, 500, '서비스가 원할하지 않아요.')))
  }
}
