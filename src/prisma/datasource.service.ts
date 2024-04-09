import { PrismaService } from '@/prisma/prisma.service'
import { Prisma, PrismaClient } from '@prisma/client'
import { Injectable } from '@nestjs/common'
import {
  InjectTransactionHost,
  TransactionHost,
} from '@nestjs-cls/transactional'
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma'
import { DefaultArgs } from '@prisma/client/runtime/library'

@Injectable()
export class DataSourceService {
  constructor(
    private readonly prismaService: PrismaService,
    @InjectTransactionHost('prisma')
    private readonly txHost: TransactionHost<
      TransactionalAdapterPrisma<PrismaClient>
    >,
  ) {}

  get manager(): Omit<
    PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
    '$transaction' | '$connect' | '$disconnect' | '$on' | '$use' | '$extends'
  > {
    return this.txHost.tx ?? this.prismaService.client
  }
}
