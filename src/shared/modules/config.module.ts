import { Module } from '@nestjs/common'
import { ConfigModule as BaseConfigModule } from '@nestjs/config'
import Joi from 'joi'
@Module({
  imports: [
    BaseConfigModule.forRoot({
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
        COOKIE_SECRET: Joi.string().required(),
        REFRESH_EXPIRES_IN: Joi.string().required(),
        ACCESS_EXPIRES_IN: Joi.string().required(),
        SALT: Joi.string().required(),
        COOL_SMS_KEY: Joi.string().required(),
        COOL_SMS_SECRET: Joi.string().required(),
      }),
    }),
  ],
})
export class ConfigModule {}
