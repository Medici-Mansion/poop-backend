import { MaxImageSize } from '@/shared/validators/max-image-size.validator'
import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'
import {
  HasMimeType,
  IsFile,
  MaxFileSize,
  MemoryStoredFile,
} from 'nestjs-form-data'

export class CreateBreedDTO {
  @ApiProperty({
    title: '견종 이미지파일',
    type: 'string',
    format: 'binary',
    description: '최대 이미지 사이즈 width :400, height : 400',
  })
  @IsFile()
  @MaxFileSize(1e6)
  @HasMimeType(['image/jpeg', 'image/png'])
  @MaxImageSize({ height: 400, width: 400 })
  avatar: MemoryStoredFile

  @ApiProperty({
    type: String,
    title: '이름 ( 한글 )',
    description: '견종 이름',
  })
  @IsString()
  nameKR: string

  @ApiProperty({
    type: String,
    title: '이름 ( 영어 )',
    description: '견종 이름',
  })
  @IsString()
  nameEN: string
}
