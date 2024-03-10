import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'

import { ExternalsService } from '@/externals/externals.service'

import { CloudinaryModule } from '@/externals/modules/cloudinary/cloudinary.module'
import { InfluxdbModule } from '@/externals/modules/influxdb/influxdb.module'

@Module({
  imports: [HttpModule, CloudinaryModule, InfluxdbModule],
  providers: [ExternalsService],
  exports: [ExternalsService],
})
export class ExternalsModule {}
