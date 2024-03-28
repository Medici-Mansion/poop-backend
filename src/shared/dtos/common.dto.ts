import { Type, applyDecorators } from '@nestjs/common'
import {
  ApiProperty,
  ApiExtraModels,
  ApiOkResponse,
  getSchemaPath,
} from '@nestjs/swagger'

import { CursorMeta } from '@/shared/interfaces/meta.interface'

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

export const ApiResultWithCursorResponse = <DataDto extends Type<unknown>>(
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
