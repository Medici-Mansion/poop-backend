import { ConfigService } from '@nestjs/config'
import { RedisModule as DefaultRedisModule } from '@liaoliaots/nestjs-redis'
import { Module } from '@nestjs/common'

import { RedisService } from '@/redis/redis.service'

import { ConfigModule } from '@/shared/modules/config.module'

import { Env } from '@/shared/interfaces/env.interface'

@Module({
  imports: [
    DefaultRedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService<Env>) => ({
        config: {
          host: configService.getOrThrow('REDIS_HOST'),
          port: configService.getOrThrow('REDIS_PORT'),
          password: configService.getOrThrow('REDIS_PWD'),
        },
        readyLog: true,
        errorLog: true,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
