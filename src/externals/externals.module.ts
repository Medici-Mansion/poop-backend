import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'

import { ExternalsService } from '@/externals/externals.service'

import { CloudinaryModule } from '@/externals/modules/cloudinary/cloudinary.module'
import { InfluxdbModule } from '@/externals/modules/influxdb/influxdb.module'
import CoolsmsMessageService from 'coolsms-node-sdk'
import { BaseService } from '@/shared/services/base.service'

@Module({
  imports: [HttpModule, CloudinaryModule, InfluxdbModule],
  providers: [
    BaseService,
    ExternalsService,
    {
      provide: CoolsmsMessageService,
      useValue: new CoolsmsMessageService(
        process.env.COOL_SMS_KEY,
        process.env.COOL_SMS_SECRET,
      ),
    },
  ],
  exports: [ExternalsService],
})
export class ExternalsModule {}
