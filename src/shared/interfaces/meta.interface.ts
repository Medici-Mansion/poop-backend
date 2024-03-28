import { ApiProperty } from '@nestjs/swagger'
import { Cursor } from 'typeorm-cursor-pagination'

export class CursorMeta implements Cursor {
  @ApiProperty({ description: '이전 페이지로 가기 위한 커서', nullable: true })
  beforeCursor: string | null

  @ApiProperty({ description: '다음 페이지로 가기 위한 커서', nullable: true })
  afterCursor: string | null
}
