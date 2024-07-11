import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

export class RemoveGraphicsDTO {
  @ApiProperty({
    title: '그래픽 아이디',
    description: '삭제하고자 하는 그래픽요소의 아이디',
  })
  @IsUUID()
  id: string
}
