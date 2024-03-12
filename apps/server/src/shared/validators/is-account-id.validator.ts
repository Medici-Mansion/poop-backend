import { applyDecorators } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, Matches, MaxLength, MinLength } from 'class-validator'

export function IsAccountId() {
  return applyDecorators(
    ApiProperty({
      description: '사용자 아이디',
      example: 'poopcoco123',
      maxLength: 16,
      minLength: 6,
    }),
    IsNotEmpty({ message: '아이디는 필수에요.' }),
    Matches(/^[A-Za-z0-9]*$/, {
      message: '아이디에 특수문자를 사용할 수 없어요.',
    }),
    MaxLength(16, { message: '아이디는 최대 16자까지 가능해요.' }),
    MinLength(6, { message: '아이디는 6자 이상이여야 해요.' }),
  )
}
