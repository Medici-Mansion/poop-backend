import { BaseService } from '@/shared/services/base.service'
import { Global, Module } from '@nestjs/common'
import { PrismaService } from './prisma.service'

@Global()
@Module({
  providers: [BaseService, PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
