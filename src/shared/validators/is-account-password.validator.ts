import { applyDecorators } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator'

export function IsAccountPassword() {
  return applyDecorators(
    ApiProperty({
      description: '사용자 비밀번호',
      example: 'poop!@#123',
      minLength: 6,
      maxLength: 20,
    }),
    IsNotEmpty({ message: '비밀번호는 필수에요.' }),
    MaxLength(20, { message: '비밀번호는 최대 20자까지 가능해요.' }),
    MinLength(6, { message: '비밀번호는 6자 이상이여야 해요.' }),
  )
}
