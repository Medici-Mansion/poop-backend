import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common'
import { FastifyReply } from 'fastify'
import { Api } from '@/shared/dtos/api.dto'
import { ApiException } from '@/shared/exceptions/exception.interface'

@Catch(ApiException)
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: ApiException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<FastifyReply>()
    console.log(`[API FILTER LOG]: ${exception}`)
    response
      .status(exception.poopError.getHttpStatusCode())
      .send(Api.ERROR(exception.poopError))
  }
}
