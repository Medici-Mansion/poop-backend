import { Module } from '@nestjs/common'
import { UsersModule } from '@/users/users.module'
import { DatabaseModule } from '@/database/database.module'
import { AppController } from '@/app.controller'
import { AuthModule } from '@/auth/auth.module'
import { ProfilesModule } from '@/profiles/profiles.module'
import { VerificationsModule } from './verifications/verifications.module'
import { ConfigModule } from '@/shared/modules/config.module'
import { ExternalsModule } from '@/externals/externals.module'
@Module({
  imports: [
    DatabaseModule,
    ConfigModule,
    UsersModule,
    AuthModule,
    ProfilesModule,
    VerificationsModule,
    ExternalsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
