import { ApiProperty } from '@nestjs/swagger'
import { IsEnum } from 'class-validator'

import { VerificationType } from '@/verifications/dtos/verify-code.dto'

import { IsEmailOrPhoneNumber } from '@/shared/validators/is-email-or-phone.validator'

export class GetUserByVidDTO {
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
