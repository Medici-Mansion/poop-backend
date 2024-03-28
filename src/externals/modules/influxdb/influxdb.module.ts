import { Module } from '@nestjs/common'
import { InfluxDBService } from '@/externals/modules/influxdb/influxDB.service'
import { InfluxDBClient } from '@influxdata/influxdb3-client'

@Module({
  providers: [
    {
      provide: InfluxDBClient,
      useValue: new InfluxDBClient({
        host: process.env.INFLUXDB_HOST,
        token: process.env.INFLUXDB_TOKEN,
        database: process.env.INFLUXDB_NAME,
      }),
    },
    InfluxDBService,
  ],
  exports: [InfluxDBService],
})
export class InfluxdbModule {}
