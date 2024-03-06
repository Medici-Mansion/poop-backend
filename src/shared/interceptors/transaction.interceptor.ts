import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { FastifyRequest } from 'fastify'
import { Observable, catchError, concatMap, finalize } from 'rxjs'
import { DataSource } from 'typeorm'
import { MANAGER_KEY } from '@/shared/constants/common.constants'

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  constructor(private dataSource: DataSource) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest<FastifyRequest>()
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
    req[MANAGER_KEY] = queryRunner.manager

    return next.handle().pipe(
      concatMap(async (data) => {
        await queryRunner.commitTransaction()
        return data
      }),
      catchError(async (e) => {
        await queryRunner.rollbackTransaction()
        throw e
      }),
      finalize(async () => {
        await queryRunner.release()
      }),
    )
  }
}
