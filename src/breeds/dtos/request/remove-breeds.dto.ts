import { ApiProperty } from '@nestjs/swagger'
import { ArrayMinSize, IsArray, IsUUID } from 'class-validator'

export class RemoveBreedsDTO {
  @ApiProperty({
    type: [String],
    description: '삭제할 견종 정보 아이디 목록',
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
