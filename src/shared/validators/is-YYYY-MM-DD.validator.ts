import { applyDecorators } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'

import { IsOnlyDate } from '@/shared/validators/is-date-string.validator'

export function IsYYYYMMDD() {
  return applyDecorators(
    ApiProperty({
      description: '사용자 생일',
      example: '1995-01-04',
    }),
    IsOnlyDate({
      message: '잘못된 날짜에요.',
    }),
  )
}
