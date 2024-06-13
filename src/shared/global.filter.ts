import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common'
import { FastifyReply } from 'fastify'
import { Api } from './dtos/api.dto'
import { ErrorCodeDetails } from './errors/error.code'

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<FastifyReply>()
    console.log(`[GLOBAL FILTER LOG]: ${exception}`)
    response
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .send(
        Api.ERROR(new ErrorCodeDetails(500, 500, '서비스가 원할하지 않아요.')),
      )
    // response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
    //   data: null,
    //   error: {
    //     statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    //     timestamp: new Date().toISOString(),
    //     path: request.url,
    //     message: 'Internal server error',
    //   },
    // })
  }
}
