import { Module } from '@nestjs/common'

import { BaseService } from '@/shared/services/base.service'
import { VerificationsService } from '@/verifications/verifications.service'

import { VerificationsController } from '@/verifications/verifications.controller'

@Module({
  controllers: [VerificationsController],
  providers: [BaseService, VerificationsService],
  exports: [VerificationsService],
})
export class VerificationsModule {}
