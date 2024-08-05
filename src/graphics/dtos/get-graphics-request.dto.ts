import { Direction } from '@/breeds/dtos/request/get-breed.dto'
import { GraphicType, GraphicsCategory } from '@/database/enums'
import { BaseGetSearchDTO } from '@/externals/modules/es/dtos/request/search-request.dto'
import { Order } from '@/shared/dtos/common.dto'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsOptional, IsUUID } from 'class-validator'

export enum GraphicOrderKey {
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  NAME = 'name',
}

export class GetGraphicsRequestDTO extends BaseGetSearchDTO {
  @ApiPropertyOptional({
    enum: GraphicType,
    nullable: true,
  })
  @IsOptional()
  @IsEnum(GraphicType)
  graphicType: GraphicType

  @ApiPropertyOptional({
    enum: GraphicOrderKey,
    description: '정렬할 필드 명',
    example: GraphicOrderKey.CREATED_AT,
    default: GraphicOrderKey.CREATED_AT,
  })
  @IsOptional()
  @IsEnum(GraphicOrderKey, {
    message: '정렬할 필드명이 올바르지 않아요.',
  })
  orderKey?: GraphicOrderKey

  @ApiPropertyOptional({
    enum: Direction,
    description: 'Order direction',
    default: Direction.DESC,
  })
  @IsOptional()
  @IsEnum(Direction, { message: 'direction must be one of asc, desc' })
  direction?: Direction

  @ApiPropertyOptional({
    enum: GraphicsCategory,
    nullable: true,
  })
  @IsOptional()
  @IsEnum(GraphicsCategory)
  category: GraphicsCategory

  @ApiPropertyOptional({
    description: '정렬순서',
    enum: Order,
    default: Order.ASC,
  })
  @IsOptional()
  @IsEnum(Order)
  order?: Order = Order.ASC
}

export class GetGraphicByIdRequestDTO {
  @ApiProperty({
    title: '그래픽 아이디',
    description: '조회하고자 하는 그래픽요소의 아이디',
  })
  @IsUUID('all', { message: '유효하지 않은 아이디에요.' })
  id: string
}
