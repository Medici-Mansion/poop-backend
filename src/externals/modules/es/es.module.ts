import { Env } from '@/shared/interfaces/env.interface'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import axios from 'axios'
import { ES_API } from './es.constant'
import { EsService } from './es.service'

@Module({
  providers: [
    {
      provide: ES_API,
      useFactory(configService: ConfigService<Env>) {
        const instance = axios.create({
          baseURL: configService.get('SEARCH_API_URL'),
        })

        return instance
      },
      inject: [ConfigService],
    },
    EsService,
  ],
  exports: [EsService],
})
export class EsModule {}
