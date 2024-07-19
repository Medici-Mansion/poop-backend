import { ApiProperty } from '@nestjs/swagger'
import { ArrayMinSize, IsArray, IsUUID } from 'class-validator'

export class RemoveGraphicsDTO {
  @ApiProperty({
    type: [String],
    title: '그래픽 아이디',
    description: '삭제하고자 하는 그래픽요소의 아이디',
    example: [
      'a8098c1a-f86e-11da-bd1a-00112444be1e',
      'a8098c1a-f86e-11da-bd1a-00112444be1f',
    ],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID('all', { each: true })
  ids: string[]
}
