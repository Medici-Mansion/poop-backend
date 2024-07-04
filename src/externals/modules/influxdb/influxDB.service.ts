import { FatalLogRequestDTO } from './dtos/fatal-log-request.dto'
import { Inject, Injectable } from '@nestjs/common'
import { InfluxDBClient, Point } from '@influxdata/influxdb3-client'
import { LogRequestDTO } from '@/externals/modules/influxdb/dtos/log-request.dto'

@Injectable()
export class InfluxDBService {
  constructor(
    @Inject(InfluxDBClient) private readonly influxDB: InfluxDBClient,
  ) {}

  async logRequest(logRequestDTO: LogRequestDTO) {
    const point = Point.measurement('log_response')
      .setTag('api', logRequestDTO.originalUrl)
      .setTag('hostname', logRequestDTO.hostname)
      .setTag('method', logRequestDTO.method)
      .setTag('userAgent', logRequestDTO.userAgent)
      .setTag('ip', logRequestDTO.ip)
      .setIntegerField('statusCode', logRequestDTO.statusCode)
      .setIntegerField('contentLength', logRequestDTO.contentLength)
      .setIntegerField('responseTime', logRequestDTO.responseTime)
    await this.influxDB.write(point, process.env.INFLUXDB_NAME)
    return true
  }

  async fatalRequest(fatalLogRequestDTO: FatalLogRequestDTO) {
    const point = Point.measurement('fatal_response')
      .setTag('api', fatalLogRequestDTO.originalUrl)
      .setTag('protocol', fatalLogRequestDTO.protocol)
      .setTag('method', fatalLogRequestDTO.method)
      .setTag('hostname', fatalLogRequestDTO.hostname)
      .setTag('ip', fatalLogRequestDTO.ip)

    await this.influxDB.write(point, process.env.INFLUXDB_NAME)
    return true
  }
}
