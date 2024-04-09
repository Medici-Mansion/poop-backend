import { Module } from '@nestjs/common'
import { InfluxDBService } from '@/externals/modules/influxdb/influxDB.service'
import { InfluxDBClient } from '@influxdata/influxdb3-client'
import { ConfigService } from '@nestjs/config'
import { Env } from '@/shared/interfaces/env.interface'

@Module({
  providers: [
    {
      provide: InfluxDBClient,
      useFactory(configService: ConfigService<Env>) {
        return new InfluxDBClient({
          host: configService.get('INFLUXDB_HOST')!,
          token: configService.get('INFLUXDB_TOKEN')!,
          database: configService.get('INFLUXDB_NAME')!,
        })
      },
      inject: [ConfigService],
    },
    InfluxDBService,
  ],
  exports: [InfluxDBService],
})
export class InfluxdbModule {}
