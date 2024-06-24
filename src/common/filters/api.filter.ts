import { ExceptionFilter, Catch, ArgumentsHost, Logger } from '@nestjs/common'
import { FastifyReply, FastifyRequest } from 'fastify'
import { Api } from '@/shared/dtos/api.dto'
import { ApiException } from '@/shared/exceptions/exception.interface'
import { ExternalsService } from '@/externals/externals.service'

@Catch(ApiException)
export class ApiExceptionFilter implements ExceptionFilter {
  private logger = new Logger(ApiExceptionFilter.name)

  constructor(private readonly externalsService: ExternalsService) {}

  catch(exception: ApiException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<FastifyReply>()

    const { ip, method, originalUrl, hostname, protocol } =
      ctx.getRequest<FastifyRequest>()

    this.logger.fatal(`[INCOMING]: ${method} ${originalUrl} ${hostname} ${ip}`)

    this.logger.fatal(`[API FILTER LOG]: ${exception}`)

    this.externalsService.fatalResponse({
      ip,
      method: method ?? '',
      originalUrl,
      hostname,
      protocol,
    })

    response
      .status(exception.poopError.getHttpStatusCode())
      .send(Api.ERROR(exception.poopError))
  }
}
