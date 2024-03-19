import { BaseService } from '@/shared/services/base.service'
import { RedisModule } from '@/redis/redis.module'
import { Module } from '@nestjs/common'
import { UsersService } from '@/users/users.service'
import { UsersController } from '@/users/users.controller'
import { VerificationsModule } from '@/verifications/verifications.module'

@Module({
  imports: [RedisModule, VerificationsModule],
  providers: [BaseService, UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
