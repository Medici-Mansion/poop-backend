import { ApiProperty } from '@nestjs/swagger'
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator'

import { IsEmailOrPhoneNumber } from '@/shared/validators/is-email-or-phone.validator'

import { VerificationType } from '@/verifications/dtos/verify-code.dto'

export class PatchPasswordDTO {
  @ApiProperty({
    description: '이메일 또는 휴대전화 인증을 통해 전달받은 코드',
    example: 'ERJ492WE338EWEQ1',
    minLength: 16,
    maxLength: 16,
  })
  @IsString()
  @Length(16, 16, { message: '올바론 코드가 아니에요.' })
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

  @ApiProperty({
    description: '변경할 비밀번호',
    example: 'poop!@#123',
    minLength: 6,
    maxLength: 20,
  })
  @IsNotEmpty({ message: '비밀번호는 필수에요.' })
  @MaxLength(20, { message: '비밀번호는 최대 20자까지 가능해요.' })
  @MinLength(6, { message: '비밀번호는 6자 이상이여야 해요.' })
  password: string
}
