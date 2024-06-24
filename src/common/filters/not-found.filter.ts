import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  NotFoundException,
  Logger,
} from '@nestjs/common'
import { FastifyReply, FastifyRequest } from 'fastify'

import { Api } from '@/shared/dtos/api.dto'
import { ResultCode } from '@/shared/errors/dtos/resultCode.dto'
import { ExternalsService } from '@/externals/externals.service'

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  constructor(private readonly externalsService: ExternalsService) {}

  private logger = new Logger(NotFoundExceptionFilter.name)
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<FastifyReply>()

    const { ip, method, originalUrl, hostname, protocol } =
      ctx.getRequest<FastifyRequest>()

    this.logger.fatal(
      `[INCOMING]:${protocol} ${method} ${originalUrl} ${hostname} ${ip}`,
    )

    this.logger.fatal(
      `[${NotFoundExceptionFilter.name} FILTER LOG]: ${exception}`,
    )
    this.logger.fatal({ exception })

    this.externalsService.fatalResponse({
      ip,
      method: method ?? '',
      originalUrl,
      hostname,
      protocol,
    })

    response
      .status(HttpStatus.NOT_FOUND)
      .send(Api.ERROR(new ResultCode(404, 404, '존재하지 않는 서비스에요.')))
  }
}
