import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { FastifyReply } from 'fastify'

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<FastifyReply>()
    const request = ctx.getRequest()

    if (exception instanceof HttpException) {
      const status = exception.getStatus()
      const exceptionResponse = exception.getResponse()
      const error =
        typeof exceptionResponse === 'string'
          ? { message: exceptionResponse }
          : exceptionResponse
      response.status(status).send({
        data: null,
        error: {
          statusCode: status,
          timestamp: new Date().toISOString(),
          path: request.url,
          ...(error ?? {}),
        },
      })
    } else {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        data: null,
        error: {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          timestamp: new Date().toISOString(),
          path: request.url,
          message: 'Internal server error',
        },
      })
    }
  }
}
