import { Module } from '@nestjs/common'
import { VerificationsService } from '@/verifications/verifications.service'
import { VerificationsController } from './verifications.controller'

@Module({
  controllers: [VerificationsController],
  providers: [VerificationsService],
  exports: [VerificationsService],
})
export class VerificationsModule {}
