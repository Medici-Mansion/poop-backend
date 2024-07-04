import { IsOptional, IsString } from 'class-validator'

export class FatalLogRequestDTO {
  @IsOptional()
  @IsString()
  protocol: string = ''

  @IsOptional()
  @IsString()
  method: string = ''

  @IsOptional()
  @IsString()
  originalUrl: string = ''

  @IsOptional()
  @IsString()
  hostname: string = ''

  @IsOptional()
  @IsString()
  ip: string = ''
}
