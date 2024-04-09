import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { PrismaClient, Prisma } from '@prisma/client'

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly prismaClient: PrismaClient) {
    this.prismaClient.$extends({
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
    await this.prismaClient.$disconnect()
  }
  async onModuleInit() {
    await this.prismaClient.$connect()
  }

  get client() {
    return this.prismaClient
  }
}
