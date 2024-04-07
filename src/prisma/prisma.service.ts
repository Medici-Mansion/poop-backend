import { BaseService } from '@/shared/services/base.service'
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { PrismaClient, Prisma } from '@prisma/client'

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private readonly baseService: BaseService) {
    super({
      log: ['query', 'error', 'info', 'warn'],
      transactionOptions: {
        isolationLevel: 'RepeatableRead',
      },
      datasources: {
        db: {
          url: baseService.conf.get('DATABASE_URL'),
        },
      },
    })

    this.$extends({
      model: {
        $allModels: {
          softDelete<T, A>(
            this: T,
            args: Prisma.Exact<A, Prisma.Args<T, 'update'>>,
          ): Prisma.Result<T, A, 'update'> {
            const context = Prisma.getExtensionContext(this)
            return (context as any).update(args)
          },
        },
      },
    })
  }
  async onModuleDestroy() {
    await this.$disconnect()
  }
  async onModuleInit() {
    await this.$connect()
  }
}
