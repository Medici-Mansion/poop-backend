import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class ChangePasswordCodeResponseDTO {
  @ApiProperty({
    example: 'ERJ492WE338EWEQ1',
    description: '비밀번호 변경 요청 시 전달해야할 토큰',
  })
  @IsString()
  code: string

  constructor(key: string) {
    this.code = key
  }
}
