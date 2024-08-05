import { ApiProperty, PickType } from '@nestjs/swagger'
import { IsNumber, IsOptional, IsString } from 'class-validator'
import { Transform, Type } from 'class-transformer'
import { SearchBaseRequestDto } from './search-base-request.dto'

export class BaseGetSearchDTO {
  @ApiProperty({
    name: 'pageSize',
    description: '최대 조회 개수',
    default: 10,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Transform(({ value }) => value ?? 10)
  pageSize: number = 10

  @ApiProperty({
    name: 'page',
    description: '페이지',
    default: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Transform(({ value }) => value ?? 1)
  page: number = 1
}

export class SearchRequestDto extends PickType(SearchBaseRequestDto, [
  'target',
]) {
  @ApiProperty({
    description: `검색어
    
검색어가 없는 경우 전체 데이터를 조회합니다.`,
    required: false,
  })
  @IsString()
  @IsOptional()
  keyword?: string

  @ApiProperty({
    name: 'pageSize',
    description: '최대 조회 개수',
    default: 10,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Transform(({ value }) => value ?? 10)
  pageSize: number = 10

  @ApiProperty({
    name: 'page',
    description: '페이지',
    default: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Transform(({ value }) => value ?? 1)
  page: number = 1
}
