import { Global, Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'

import { VerificationsModule } from '@/verifications/verifications.module'
import { ExternalsModule } from '@/externals/externals.module'
import { RedisModule } from '@/redis/redis.module'
import { UsersModule } from '@/users/users.module'

import { AuthController } from '@/auth/auth.controller'

import { AuthService } from '@/auth/auth.service'
import { BaseService } from '@/shared/services/base.service'
import { AuthRepository } from './auth.repository'

@Global()
@Module({
  imports: [
    RedisModule,
    JwtModule.register({
      publicKey: process.env.JWT_PUBLIC_KEY,
      privateKey: process.env.JWT_PRIVATE_KEY,
    }),
    UsersModule,
    VerificationsModule,
    ExternalsModule,
  ],
  providers: [BaseService, AuthService, AuthRepository],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
