import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsString, Length } from 'class-validator'
import { AuthTokenResponse } from '@/shared/interfaces/token.interface'

import { IsEmailOrPhoneNumber } from '@/shared/validators/is-email-or-phone.validator'

export enum VerificationType {
  // EMAIL = 'email',
  PHONE = 'phone',
}

export class VerifyCodeDTO {
  @ApiProperty({
    description: '이메일 또는 휴대전화로 받은 코드',
    example: '348509',
    minLength: 6,
    maxLength: 6,
  })
  @IsString()
  @Length(6, 6, { message: '유효하지 않은 형식이에요.' })
  code: string

  @ApiProperty({
    description: '코드를 전송받은 매체 ( 휴대전화)',
    example: VerificationType.PHONE,
    type: VerificationType,
    enum: VerificationType,
  })
  @IsEnum(VerificationType, { message: '유효하지 않은 형식이에요.' })
  type: VerificationType

  @ApiProperty({
    description: '인증받은 매체의 값 ( 휴대전화번호)',
    example: '01099999999',
  })
  @IsEmailOrPhoneNumber({ message: '유효하지 않은 형식이에요.' })
  vid: string
}

export class VerifyingCodeResponseDTO {
  @ApiProperty({
    description: '엑세스 토큰. 유효시간 30일',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzaWQiOiI4M2NkYjIxZC0xOWNjLTQ1ZmMtYTNlMi1jN2Y3ODlhZDlhMjQiLCJpYXQiOjE3MDk3MDYxNjIsImV4cCI6MTcwOTcwOTc2Mn0.KdaxEM8bzNFsu5wRQIPn5pCmENnHOEMSRd5PUZwRcNA',
  })
  @IsString()
  accessToken: string

  constructor({ accessToken }: AuthTokenResponse) {
    this.accessToken = accessToken
  }
}
