import { BaseService } from '@/shared/services/base.service'
import { Global, Module } from '@nestjs/common'
import { PrismaService } from './prisma.service'
import { DataSourceService } from './datasource.service'
import { PrismaClient } from '@prisma/client'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { Env } from '@/shared/interfaces/env.interface'
import prisma from '@/prisma/prisma'

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    BaseService,
    {
      provide: PrismaClient,
      useFactory(configService: ConfigService<Env>) {
        return prisma
      },
      inject: [ConfigService],
    },
    PrismaService,
    DataSourceService,
  ],
  exports: [PrismaService, DataSourceService, PrismaClient],
})
export class PrismaModule {}
