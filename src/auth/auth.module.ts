import { Global, Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'

import { VerificationsModule } from '@/verifications/verifications.module'
import { ExternalsModule } from '@/externals/externals.module'
import { UsersModule } from '@/users/users.module'

import { AuthService } from '@/auth/auth.service'

import { AuthController } from '@/auth/auth.controller'

@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    UsersModule,
    VerificationsModule,
    ExternalsModule,
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
