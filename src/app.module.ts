import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { NestjsFormDataModule } from 'nestjs-form-data'

import { AppController } from '@/app.controller'

import { UsersModule } from '@/users/users.module'
import { DatabaseModule } from '@/database/database.module'
import { AuthModule } from '@/auth/auth.module'
import { ProfilesModule } from '@/profiles/profiles.module'
import { VerificationsModule } from '@/verifications/verifications.module'
import { ConfigModule } from '@/shared/modules/config.module'
import { ExternalsModule } from '@/externals/externals.module'

import { LoggingMiddleware } from '@/shared/middlewares/logging.middleware'

import { ResponseInterceptor } from '@/shared/interceptors/response.interceptor'
import { RedisModule } from '@/redis/redis.module'

@Module({
  imports: [
    NestjsFormDataModule.config({ isGlobal: true, autoDeleteFile: true }),
    DatabaseModule,
    ConfigModule,
    UsersModule,
    AuthModule,
    ProfilesModule,
    VerificationsModule,
    ExternalsModule,
    RedisModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*')
  }
}
