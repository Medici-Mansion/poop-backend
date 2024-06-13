import { Module } from '@nestjs/common'

import { BaseService } from '@/shared/services/base.service'
import { VerificationsService } from '@/verifications/verifications.service'

import { VerificationsController } from '@/verifications/verifications.controller'
import { VerificationsRepository } from '@/verifications/verifications.repository'

@Module({
  controllers: [VerificationsController],
  providers: [BaseService, VerificationsService, VerificationsRepository],
  exports: [VerificationsService],
})
export class VerificationsModule {}
