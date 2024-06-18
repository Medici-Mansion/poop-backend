import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common'
import { FastifyReply } from 'fastify'

import { Api } from '@/shared/dtos/api.dto'
import { ResultCode } from '@/shared/errors/dtos/resultCode.dto'

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<FastifyReply>()
    console.log(`[${NotFoundExceptionFilter.name} FILTER LOG]: ${exception}`)
    console.log({ exception })
    response
      .status(HttpStatus.NOT_FOUND)
      .send(Api.ERROR(new ResultCode(404, 404, '존재하지 않는 서비스에요.')))
  }
}
