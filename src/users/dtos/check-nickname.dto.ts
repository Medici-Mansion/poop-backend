import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, Length } from 'class-validator'

export class CheckNicknameDTO {
  @ApiProperty({
    title: '닉네임 중복 체크',
    example: 'raymond',
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 15)
  nickname: string
}
