import { GraphicType, GraphicsCategory } from '@/database/enums'
import { Graphics } from '@/database/types'
import { ApiProperty } from '@nestjs/swagger'
import { Selectable } from 'kysely'

export class GetGraphicsResponseDTO {
  @ApiProperty({ nullable: true })
  category!: GraphicsCategory | null

  @ApiProperty()
  id: string

  @ApiProperty({ nullable: true })
  name!: string | null

  @ApiProperty()
  type: GraphicType

  @ApiProperty({ nullable: true })
  url!: string | null

  constructor(graphic: Selectable<Graphics>) {
    this.category = graphic.category
    this.id = graphic.id
    this.name = graphic.name
    this.type = graphic.type
    this.url = graphic.url
  }
}
