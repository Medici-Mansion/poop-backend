import { SocialProvider } from '@/shared/constants/strategy.constant'
import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsString } from 'class-validator'

export class SocialDTO {
  @IsEnum(SocialProvider)
  @ApiProperty({ enum: SocialProvider })
  provider: SocialProvider

  @ApiProperty()
  @IsString()
  token: string
}
