import { IsNumber, IsOptional, IsString } from 'class-validator'

export class LogRequestDTO {
  @IsString()
  @IsOptional()
  method?: string

  @IsString()
  @IsOptional()
  originalUrl?: string

  @IsNumber()
  @IsOptional()
  statusCode?: number

  @IsNumber()
  @IsOptional()
  responseTime?: number

  @IsString()
  @IsOptional()
  contentLength?: string

  @IsString()
  @IsOptional()
  userAgent?: string

  @IsString()
  @IsOptional()
  ip?: string

  @IsString()
  @IsOptional()
  hostname?: string

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
    method?: string
    originalUrl?: string
    statusCode?: number
    responseTime?: number
    contentLength?: string
    userAgent?: string
    ip?: string
    hostname?: string
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
