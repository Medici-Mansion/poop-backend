import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common'
import { FastifyReply } from 'fastify'
import { Api } from './dtos/api.dto'
import { ResultCode } from '@/shared/errors/dtos/resultCode.dto'

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<FastifyReply>()
    console.log(`[GLOBAL FILTER LOG]: ${exception}`)
    response
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .send(Api.ERROR(new ResultCode(500, 500, '서비스가 원할하지 않아요.')))
  }
}
