import { Exclude, Expose } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

@Exclude()
export class SearchResponseBaseDto {
  @ApiProperty({
    type: Number,
    description: '검색 소요 시간 (ms)',
    example: 10,
    required: true,
  })
  @Expose()
  took!: number

  @ApiProperty({
    type: Number,
    description: '검색 결과 전체 갯수 (페이징 되지 않은 전체 건수)',
    example: 100,
    required: true,
  })
  @Expose()
  total!: number

  @ApiProperty({
    type: Number,
    description: '검색 결과 전체 페이지수',
    example: 10,
    required: true,
  })
  @Expose()
  totalPage!: number

  @ApiProperty({
    type: Number,
    description: '현재 페이지 번호 (1부터 시작)',
    example: 10,
    required: true,
  })
  @Expose()
  page!: number
}
