import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { NestjsFormDataModule } from 'nestjs-form-data'
import { ClsModule } from 'nestjs-cls'
import { ClsPluginTransactional } from '@nestjs-cls/transactional'

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
import { ToonModule } from './toon/toon.module'
import { DatabaseModule } from './database/database.module'
import { TransactionalAdapterKysely } from '@nestjs-cls/transactional-adapter-kysely'
import { Database } from './database/database.class'

@Module({
  imports: [
    RedisModule,
    NestjsFormDataModule.config({ isGlobal: true, autoDeleteFile: true }),
    ClsModule.forRoot({
      plugins: [
        new ClsPluginTransactional({
          imports: [DatabaseModule],
          adapter: new TransactionalAdapterKysely({
            kyselyInstanceToken: Database,
          }),
        }),
      ],
      global: true,
    }),
    ConfigModule,
    UsersModule,
    AuthModule,
    ProfilesModule,
    VerificationsModule,
    ExternalsModule,
    BreedsModule,
    CommonModule,
    ToonModule,
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
