import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class LoginProfileDTO {
  @ApiProperty({
    title: '로그인하려는 프로필 아이디',
  })
  @IsString()
  profileId: string
}
