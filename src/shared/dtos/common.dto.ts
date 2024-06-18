// import { type Type as Tp, applyDecorators } from '@nestjs/common'
import {
  ApiProperty,
  // ApiExtraModels,
  // ApiOkResponse,
  // getSchemaPath,
  ApiPropertyOptional,
} from '@nestjs/swagger'

// import { CursorMeta } from '@/shared/interfaces/meta.interface'
import { IsEnum, IsInt, IsOptional, IsString, Max } from 'class-validator'
import { Type } from 'class-transformer'

export enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class CursorOption {
  @IsOptional()
  @IsInt()
  @Max(15)
  @Type(() => Number)
  @ApiProperty({
    description: 'limit 최대 15까지 가능',
    required: false,
    example: 10,
    default: 10,
  })
  limit?: number = 10

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: '커서', required: false })
  cursor?: string

  @IsOptional()
  @IsEnum(Order)
  @ApiPropertyOptional({
    description: '정렬순서',
    enum: Order,
    default: Order.ASC,
  })
  order?: Order = Order.ASC
}
