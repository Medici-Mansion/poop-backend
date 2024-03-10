import { applyDecorators } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsUUID } from 'class-validator'

export function IsUserId() {
  return applyDecorators(
    ApiProperty({
      description: '사용자 PK',
      example: 'cd18f08f-de25-442b-9e51-d55c1332185c',
      maxLength: 16,
      minLength: 6,
    }),
    IsNotEmpty(),
    IsUUID('all'),
  )
}
