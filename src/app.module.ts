import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { NestjsFormDataModule } from 'nestjs-form-data'

import { AppController } from '@/app.controller'

import { UsersModule } from '@/users/users.module'
import { AuthModule } from '@/auth/auth.module'
import { ProfilesModule } from '@/profiles/profiles.module'
import { VerificationsModule } from '@/verifications/verifications.module'
import { ConfigModule } from '@/shared/modules/config.module'
import { ExternalsModule } from '@/externals/externals.module'
import { RedisModule } from '@/redis/redis.module'
import { BreedsModule } from '@/breeds/breeds.module'
import { CommonModule } from '@/common/common.module'

import { LoggingMiddleware } from '@/shared/middlewares/logging.middleware'

import { ResponseInterceptor } from '@/shared/interceptors/response.interceptor'
import { BaseService } from '@/shared/services/base.service'
import { PrismaModule } from '@/prisma/prisma.module'

@Module({
  imports: [
    RedisModule,
    NestjsFormDataModule.config({ isGlobal: true, autoDeleteFile: true }),
    // DatabaseModule,
    PrismaModule,
    ConfigModule,
    UsersModule,
    AuthModule,
    ProfilesModule,
    VerificationsModule,
    ExternalsModule,
    BreedsModule,
    CommonModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    BaseService,
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*')
  }
}
