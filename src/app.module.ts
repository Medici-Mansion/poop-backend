import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { NestjsFormDataModule } from 'nestjs-form-data'
import { ClsModule } from 'nestjs-cls'
import { ClsPluginTransactional } from '@nestjs-cls/transactional'
import { TransactionalAdapterKysely } from '@nestjs-cls/transactional-adapter-kysely'

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
import { ToonModule } from '@/toon/toon.module'
import { DatabaseModule } from '@/database/database.module'

import { LoggingMiddleware } from '@/shared/middlewares/logging.middleware'

import { BaseService } from '@/shared/services/base.service'
import { Database } from '@/database/database.class'

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
  providers: [BaseService],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*')
  }
}
