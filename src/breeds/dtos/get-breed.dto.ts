import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString, IsUUID } from 'class-validator'

import { CursorOption } from '@/shared/dtos/common.dto'

import { SearchBreeds } from '@/database/types'
import { Selectable } from 'kysely'

export class GetBreadRequestDTO extends CursorOption {
  @ApiProperty({
    description: '초성검색 키워드',
    required: false,
  })
  @IsOptional()
  @IsString()
  searchKey?: string
}

export class GetBreedResponseDTO {
  @ApiProperty({
    description: 'PK',
    example: 'cd18f08f-de25-442b-9e51-d55c1332185c',
    maxLength: 16,
    minLength: 6,
  })
  @IsUUID('all')
  id!: string

  @ApiProperty({ description: '이름', example: '나폴리탄 마스티프' })
  name!: string

  @ApiProperty({
    description: '영어 이름',
    nullable: true,
    example: 'Neapolitan Mastiff',
  })
  nameEN: string

  @ApiProperty({
    description: '아바타 이미지 주소',
    nullable: true,
    example:
      'https://res.cloudinary.com/poop-storage/image/upload/f_auto,w_160,q_auto/v1/avatar/owxgmx1tck0esbrdhf8a',
  })
  avatar: string

  constructor(breeds: Selectable<SearchBreeds>) {
    this.id = breeds.id
    this.name = breeds.nameKR
    this.nameEN = breeds.nameEN!
    this.avatar = breeds.avatar || ''
  }
}
