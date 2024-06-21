import { GraphicType, GraphicsCategory } from '@/database/enums'
import { Order } from '@/shared/dtos/common.dto'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsOptional } from 'class-validator'

export class GetGraphicsRequestDTO {
  @ApiPropertyOptional({
    enum: GraphicType,
    nullable: true,
  })
  @IsOptional()
  @IsEnum(GraphicType)
  graphicType: GraphicType

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
