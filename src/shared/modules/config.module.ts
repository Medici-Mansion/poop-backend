import { Module } from '@nestjs/common'
import { ConfigModule as BaseConfigModule } from '@nestjs/config'
import Joi from 'joi'

import { Env } from '@/shared/interfaces/env.interface'

@Module({
  imports: [
    BaseConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
      validationSchema: Joi.object<Required<Env>>({
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
        MAILGUN_DOMAIN: Joi.string().required(),
        MAILGUN_API_KEY: Joi.string().required(),
        CLOUDINARY_API_KEY: Joi.string().required(),
        CLOUDINARY_API_SECRET: Joi.string().required(),
        CLOUDINARY_CLOUD_NAME: Joi.string().required(),
        INFLUXDB_TOKEN: Joi.string().required(),
        INFLUXDB_HOST: Joi.string().required(),
        INFLUXDB_NAME: Joi.string().required(),
      }),
    }),
  ],
})
export class ConfigModule {}
