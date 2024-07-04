import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import CoolsmsMessageService from 'coolsms-node-sdk'

import { ExternalsService } from '@/externals/externals.service'
import { BaseService } from '@/shared/services/base.service'

import { CloudinaryModule } from '@/externals/modules/cloudinary/cloudinary.module'
import { InfluxdbModule } from '@/externals/modules/influxdb/influxdb.module'
import { ConfigService } from '@nestjs/config'
import { Env } from '@/shared/interfaces/env.interface'
import { AwsModule } from '@/externals/modules/aws/aws.module'

@Module({
  imports: [HttpModule, CloudinaryModule, AwsModule, InfluxdbModule],
  providers: [
    BaseService,
    ExternalsService,
    {
      provide: CoolsmsMessageService,
      useFactory(configService: ConfigService<Env>) {
        return new CoolsmsMessageService(
          configService.get('COOL_SMS_KEY')!,
          configService.get('COOL_SMS_SECRET')!,
        )
      },
      inject: [ConfigService],
    },
  ],
  exports: [ExternalsService],
})
export class ExternalsModule {}
