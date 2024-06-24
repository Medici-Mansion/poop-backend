import { GraphicType, GraphicsCategory } from '@/database/enums'
import { Order } from '@/shared/dtos/common.dto'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsOptional, IsUUID } from 'class-validator'

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

export class GetGraphicByIdRequestDTO {
  @ApiProperty({
    title: '그래픽 아이디',
    description: '조회하고자 하는 그래픽요소의 아이디',
  })
  @IsUUID('all', { message: '유효하지 않은 아이디에요.' })
  id: string
}
