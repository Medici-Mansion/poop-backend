import { GraphicsCategory } from '@/database/enums'
import { DB } from '@/database/types'
import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsString } from 'class-validator'
import { Insertable } from 'kysely'
import {
  HasMimeType,
  IsFile,
  MaxFileSize,
  MemoryStoredFile,
} from 'nestjs-form-data'

export class CreateGraphicsDTO
  implements Omit<Insertable<DB['graphics']>, 'url' | 'type'>
{
  @IsString()
  @ApiProperty({ type: String, description: '그래픽 주체 이름' })
  name: string

  @ApiProperty({
    title: '그래픽 파일',
    type: 'string',
    format: 'binary',
    description: 'GIF / Lottie-json 파일만 업로드 가능합니다.',
  })
  @MaxFileSize(1e6)
  @HasMimeType(['image/gif', 'application/json'])
  @IsFile()
  file: MemoryStoredFile

  @ApiProperty({
    enum: GraphicsCategory,
    description: '그래픽 검색시 분류되는 기준',
  })
  @IsEnum(GraphicsCategory)
  category: GraphicsCategory
}
