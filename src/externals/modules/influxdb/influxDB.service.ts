import { Injectable } from '@nestjs/common'
import { InfluxDBClient, Point } from '@influxdata/influxdb3-client'
import { BaseService } from '@/shared/services/base.service'
import { LogRequestDTO } from './dtos/log-request.dto'

@Injectable()
export class InfluxDBService extends BaseService {
  private influxDB: InfluxDBClient

  constructor() {
    super()

    this.influxDB = new InfluxDBClient({
      host: process.env.INFLUXDB_HOST,
      token: process.env.INFLUXDB_TOKEN,
      database: process.env.INFLUXDB_NAME,
    })
  }

  async logRequest(LogRequestDTO: LogRequestDTO) {
    const point = Point.measurement('log_response')

    Object.entries(LogRequestDTO).forEach(([key, value]) => {
      point.setTag(key, value)
    })
    console.log(point, '!!', process.env.INFLUXDB_NAME)

    await this.influxDB.write(point, process.env.INFLUXDB_NAME)
    await this.influxDB.close()
    return true
  }
}
