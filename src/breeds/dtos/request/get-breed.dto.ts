import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator'

import { CursorOption } from '@/shared/dtos/common.dto'

import { Selectable } from 'kysely'
import { Breed } from '@/database/types'

export enum OrderKey {
  CREATED_AT = 'createdAt',
  NAME_KR = 'nameKR',
  NAME_EN = 'nameEN',
}

export enum Direction {
  ASC = 'asc',
  DESC = 'desc',
}

export class OrderBreedDTO {
  @ApiPropertyOptional({
    enum: OrderKey,
    description: 'Order key',
    default: OrderKey.CREATED_AT,
  })
  @IsOptional()
  @IsEnum(OrderKey, {
    message: 'orderKey must be one of createdAt, nameKR, nameEN',
  })
  orderKey?: OrderKey

  @ApiPropertyOptional({
    enum: Direction,
    description: 'Order direction',
    default: Direction.DESC,
  })
  @IsOptional()
  @IsEnum(Direction, { message: 'direction must be one of asc, desc' })
  direction?: Direction

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: '커서', required: false })
  cursor?: string
}

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
  nameKR!: string

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

  constructor(breeds: Selectable<Breed>) {
    console.log(breeds)
    this.id = breeds.id
    this.nameKR = breeds.nameKR
    this.nameEN = breeds.nameEN!
    this.avatar = breeds.avatar || ''
  }
}
