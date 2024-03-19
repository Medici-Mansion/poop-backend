import { Global, Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'

import { VerificationsModule } from '@/verifications/verifications.module'
import { ExternalsModule } from '@/externals/externals.module'
import { RedisModule } from '@/redis/redis.module'
import { UsersModule } from '@/users/users.module'

import { AuthController } from '@/auth/auth.controller'

import { AuthService } from '@/auth/auth.service'
import { BaseService } from '@/shared/services/base.service'

@Global()
@Module({
  imports: [
    RedisModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    UsersModule,
    VerificationsModule,
    ExternalsModule,
  ],
  providers: [BaseService, AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
