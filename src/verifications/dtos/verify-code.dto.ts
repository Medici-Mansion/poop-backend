import { AuthTokenResponse } from '@/shared/interfaces/token.interface'
import { IsEmailOrPhoneNumber } from '@/shared/validators/is-email-or-phone.validator'
import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsString, Length } from 'class-validator'

export enum VerificationType {
  EMAIL = 'EMAIL',
  PHONE = 'PHONE',
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
    description: '코드를 전송받은 매체 (이메일, 휴대전화)',
    example: VerificationType.EMAIL,
    type: VerificationType,
    enum: VerificationType,
  })
  @IsEnum(VerificationType, { message: '유효하지 않은 형식이에요.' })
  type: VerificationType

  @ApiProperty({
    description: '인증받은 매체의 값 (이메일주소, 휴대전화번호)',
    example: 'akdfhr2@gmail.com',
  })
  @IsEmailOrPhoneNumber({ message: '유효하지 않은 형식이에요.' })
  vid: string
}

export class VerifyingCodeResponseDTO {
  @ApiProperty({
    description: '엑세스 토큰. 유효시간 1시간',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzaWQiOiI4M2NkYjIxZC0xOWNjLTQ1ZmMtYTNlMi1jN2Y3ODlhZDlhMjQiLCJpYXQiOjE3MDk3MDYxNjIsImV4cCI6MTcwOTcwOTc2Mn0.KdaxEM8bzNFsu5wRQIPn5pCmENnHOEMSRd5PUZwRcNA',
  })
  @IsString()
  accessToken: string

  @ApiProperty({
    description: '리프레시 토큰. 유효시간 30일',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzaWQiOiI4M2NkYjIxZC0xOWNjLTQ1ZmMtYTNlMi1jN2Y3ODlhZDlhMjQiLCJpYXQiOjE3MDk3MDYxNjIsImV4cCI6MTcxMjI5ODE2Mn0.wICUB_UrDGM1rQWezZC2ytA6V1quQqzpp3r62IjvZu0',
  })
  @IsString()
  refreshToken: string
  constructor({ accessToken, refreshToken }: AuthTokenResponse) {
    this.accessToken = accessToken
    this.refreshToken = refreshToken
  }
}
