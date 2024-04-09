import { Module } from '@nestjs/common'

import { RedisModule } from '@/redis/redis.module'

import { UsersService } from '@/users/users.service'

import { UsersController } from '@/users/users.controller'

import { VerificationsModule } from '@/verifications/verifications.module'

@Module({
  imports: [RedisModule, VerificationsModule],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
