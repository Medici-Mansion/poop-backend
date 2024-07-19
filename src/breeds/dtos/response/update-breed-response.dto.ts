import { IsYYYYMMDD } from '@/shared/validators/is-YYYY-MM-DD.validator'
import { IsUserId } from '@/shared/validators/is-user-id.validator'
import { ApiProperty } from '@nestjs/swagger'
import { Breed } from '@prisma/client'
import { Selectable } from 'kysely'

export class UpdateBreedResponseDTO {
  @IsUserId()
  id: string

  @IsYYYYMMDD()
  createdAt: Date

  @IsYYYYMMDD()
  updatedAt: Date

  @ApiProperty({
    title: '견종 이미지파일',
    nullable: true,
  })
  avatar: string | null

  @ApiProperty({
    type: String,
    title: '이름 ( 한글 )',
    description: '견종 이름',
  })
  nameKR: string

  @ApiProperty({
    type: String,
    title: '이름 ( 영어 )',
    description: '견종 이름',
  })
  nameEN: string | null

  constructor(breed: Selectable<Breed>) {
    this.id = breed.id
    this.createdAt = breed.createdAt
    this.updatedAt = breed.updatedAt
    this.avatar = breed.avatar
    this.nameEN = breed.nameEN
    this.nameKR = breed.nameKR
  }
}
