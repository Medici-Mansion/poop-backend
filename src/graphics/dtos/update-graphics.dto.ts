import { GraphicType, GraphicsCategory } from '@/database/enums'
import { DB } from '@/database/types'
import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator'
import { Insertable } from 'kysely'
import {
  HasMimeType,
  IsFile,
  MaxFileSize,
  MemoryStoredFile,
} from 'nestjs-form-data'

export class UpdateGraphicsDTO
  implements Omit<Insertable<DB['graphics']>, 'url' | 'type'>
{
  @ApiProperty({
    title: '그래픽 아이디',
    description: '변경하고자 하는 그래픽요소의 아이디',
  })
  @IsUUID()
  id: string

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: '그래픽 주체 이름',
    nullable: true,
    required: false,
  })
  name: string

  @ApiProperty({
    title: '그래픽 파일',
    type: 'string',
    format: 'binary',
    nullable: true,
    description: 'GIF / Lottie-json 파일만 업로드 가능합니다.',
    required: false,
  })
  @IsOptional()
  @IsFile()
  @MaxFileSize(1e6)
  @HasMimeType(['image/gif', 'application/json'])
  file: MemoryStoredFile

  @ApiProperty({
    enum: GraphicsCategory,
    description: '그래픽 검색시 분류되는 기준',
    nullable: true,
    required: false,
  })
  @IsOptional()
  @IsEnum(GraphicsCategory)
  category: GraphicsCategory

  @ApiProperty({
    enum: GraphicType,
    description: '그래픽 요소 타입',
    nullable: true,
    required: false,
  })
  @IsOptional()
  @IsEnum(GraphicType)
  type: GraphicType
}
