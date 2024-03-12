import { Module } from '@nestjs/common'
import { InfluxDBService } from '@/externals/modules/influxdb/influxDB.service'

@Module({
  providers: [InfluxDBService],
  exports: [InfluxDBService],
})
export class InfluxdbModule {}
