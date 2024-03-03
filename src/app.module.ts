import { Module } from '@nestjs/common'
import { UsersModule } from '@/users/users.module'
import Joi from 'joi'
import { ConfigModule } from '@nestjs/config'
import { DatabaseModule } from '@/database/database.module'
import { CommonModule } from '@/common/common.module'
import { AppController } from '@/app.controller'
import { AuthModule } from './auth/auth.module'
@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
      validationSchema: Joi.object<Required<typeof process.env>>({
        NODE_ENV: Joi.valid(
          ...['production', 'development', 'test'],
        ).required(),
        JWT_SECRET: Joi.string().required(),
        HASH_ROUNDS: Joi.string().required(),
        SSL_MODE: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().required(),
        DB_USER: Joi.string().required(),
        DB_PWD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        CA_CERT: Joi.string().required(),
      }),
    }),
    UsersModule,
    CommonModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
