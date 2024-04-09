import { IsNumber, IsString } from 'class-validator'

export class LogRequestDTO {
  @IsString()
  method: string

  @IsString()
  originalUrl: string

  @IsNumber()
  statusCode: number

  @IsNumber()
  responseTime: number

  @IsString()
  contentLength: string

  @IsString()
  userAgent: string

  @IsString()
  ip: string

  @IsString()
  hostname: string

  constructor({
    method,
    originalUrl,
    statusCode,
    responseTime,
    contentLength,
    userAgent,
    ip,
    hostname,
  }: {
    method: string
    originalUrl: string
    statusCode: number
    responseTime: number
    contentLength: string
    userAgent: string
    ip: string
    hostname: string
  }) {
    this.method = method
    this.originalUrl = originalUrl
    this.statusCode = statusCode
    this.contentLength = contentLength
    this.userAgent = userAgent
    this.ip = ip
    this.responseTime = responseTime
    this.hostname = hostname
  }
}
