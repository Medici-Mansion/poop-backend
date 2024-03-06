import { IsEmailOrPhoneNumber } from '@/shared/validators/is-email-or-phone.validator'
import { VerificationType } from '@/verifications/dtos/verify-code.dto'
import { ApiProperty } from '@nestjs/swagger'
import { IsEnum } from 'class-validator'

export class GetUserByVidDTO {
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
