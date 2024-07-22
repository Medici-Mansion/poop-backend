import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString, IsUUID } from 'class-validator'
import { HasMimeType, IsFile, MemoryStoredFile } from 'nestjs-form-data'

export class UpdateBreedDTO {
  @ApiProperty({
    title: '견종 정보 아이디',
    description: '변경하고자 하는 견종 정보의 아이디',
  })
  @IsUUID()
  id: string

  @ApiProperty({
    title: '견종 이미지파일',
    type: 'string',
    format: 'binary',
    description: '최대 이미지 사이즈 width :400, height : 400',
    nullable: true,
    required: false,
  })
  @IsOptional()
  @IsFile()

  // FIXME
  // @MaxFileSize(1e6)
  // @MaxImageSize({ height: 400, width: 400 })
  @HasMimeType(['image/jpeg', 'image/png'])
  file: MemoryStoredFile

  @ApiProperty({
    type: String,
    title: '이름 ( 한글 )',
    description: '견종 이름',
    nullable: true,
    required: false,
  })
  @IsOptional()
  @IsString()
  nameKR: string

  @ApiProperty({
    type: String,
    title: '이름 ( 영어 )',
    description: '견종 이름',
    nullable: true,
    required: false,
  })
  @IsOptional()
  @IsString()
  nameEN: string
}
