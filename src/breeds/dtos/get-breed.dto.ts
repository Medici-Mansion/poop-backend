import { IsYYYYMMDD } from '@/shared/validators/is-YYYY-MM-DD.validator'
import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString, IsUUID } from 'class-validator'
import { SearchBreeds } from '@/breeds/models/breeds.model'

export class GetBreadRequestDTO {
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
  id: string

  @IsYYYYMMDD()
  createdAt: Date

  @IsYYYYMMDD()
  updatedAt: Date

  @ApiProperty({ description: '이름' })
  name: string

  @ApiProperty({ description: '아바타 이미지 주소', nullable: true })
  avatar: string

  constructor(breeds: SearchBreeds) {
    this.id = breeds.id
    this.name = breeds.name
    this.avatar = breeds.avatar
    this.updatedAt = breeds.updatedAt
    this.createdAt = breeds.createdAt
  }
}
