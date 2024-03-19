import { Injectable } from '@nestjs/common'
import { InfluxDBClient, Point } from '@influxdata/influxdb3-client'
import { LogRequestDTO } from './dtos/log-request.dto'

@Injectable()
export class InfluxDBService {
  private influxDB: InfluxDBClient

  constructor() {
    this.influxDB = new InfluxDBClient({
      host: process.env.INFLUXDB_HOST,
      token: process.env.INFLUXDB_TOKEN,
      database: process.env.INFLUXDB_NAME,
    })
  }

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
    await this.influxDB.close()
    return true
  }
}
