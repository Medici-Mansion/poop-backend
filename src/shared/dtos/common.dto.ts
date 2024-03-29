import { type Type as Tp, applyDecorators } from '@nestjs/common'
import {
  ApiProperty,
  ApiExtraModels,
  ApiOkResponse,
  getSchemaPath,
  ApiPropertyOptional,
} from '@nestjs/swagger'

import { CursorMeta } from '@/shared/interfaces/meta.interface'
import { IsInt, IsOptional, IsString } from 'class-validator'
import { Type } from 'class-transformer'

export class ResponseWithCursor<T> {
  @ApiProperty({ description: '결과' })
  items: T[]

  @ApiProperty({ description: '커서 메타 ' })
  meta: CursorMeta
  constructor(items: T[], meta: CursorMeta) {
    this.items = items
    this.meta = meta
  }
}

export const ApiResultWithCursorResponse = <DataDto extends Tp<unknown>>(
  dataDto: DataDto,
  // eslint-disable-next-line @typescript-eslint/ban-types
  model: Function = ResponseWithCursor,
): any =>
  applyDecorators(
    ApiExtraModels(model, dataDto),
    ApiOkResponse({
      description: 'OK',
      schema: {
        allOf: [
          { $ref: getSchemaPath(model) },
          {
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(dataDto) },
              },
            },
          },
        ],
      },
    }),
  )

export class CursorOption {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @ApiProperty({
    description: 'limit',
    required: false,
    example: 10,
    default: 10,
  })
  limit?: number = 10

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: '커서', required: false })
  cursor?: string
}
