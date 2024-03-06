import { Global, Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { AuthService } from '@/auth/auth.service'
import { AuthController } from '@/auth/auth.controller'
import { UsersModule } from '@/users/users.module'
import { VerificationsModule } from '@/verifications/verifications.module'

@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    UsersModule,
    VerificationsModule,
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
