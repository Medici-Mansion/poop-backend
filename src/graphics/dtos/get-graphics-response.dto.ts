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

  @ApiProperty({
    enum: GraphicType,
    title: '그래픽 타입',
    description: '그래픽 자료의 타입 (Lottie/GIF)',
  })
  type: GraphicType

  @ApiProperty({
    nullable: true,
    title: '그래픽 요청 주소',
    description:
      '그래픽 타입에 따라 다양한 종류의 에셋 데이터를 전송받기 위한 주소',
  })
  url!: string | null

  constructor(graphic: Selectable<Graphics>) {
    this.category = graphic.category
    this.id = graphic.id
    this.name = graphic.name
    this.type = graphic.type
    this.url = graphic.url
  }
}
