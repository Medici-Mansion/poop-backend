import { BaseService } from '@/shared/services/base.service'
import { Global, Module } from '@nestjs/common'
import { PrismaService } from './prisma.service'
import { DataSourceService } from './datasource.service'

@Global()
@Module({
  providers: [BaseService, PrismaService, DataSourceService],
  exports: [PrismaService, DataSourceService],
})
export class PrismaModule {}
