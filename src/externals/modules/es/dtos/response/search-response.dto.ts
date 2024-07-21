import { Exclude, Expose } from 'class-transformer';
import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { PoopProfileDataDto } from '../../../es/dto/data/poop-profile-data.dto';
import { PoopBreedDataDto } from '../../../es/dto/data/poop-breed-data.dto';

@ApiExtraModels(PoopProfileDataDto, PoopBreedDataDto)
@Exclude()
export class SearchResponseDto {
  @ApiProperty({
    type: Number,
    description: '검색 소요 시간 (ms)',
    example: 10,
    required: true,
  })
  @Expose()
  took!: number;

  @ApiProperty({
    type: Number,
    description: '검색 결과 전체 갯수 (페이징 되지 않은 전체 건수)',
    example: 100,
    required: true,
  })
  @Expose()
  total!: number;

  @ApiProperty({
    type: Number,
    description: '검색 결과 전체 페이지수',
    example: 10,
    required: true,
  })
  @Expose()
  totalPage!: number;

  @ApiProperty({
    type: Number,
    description: '현재 페이지 번호 (1부터 시작)',
    example: 10,
    required: true,
  })
  @Expose()
  page!: number;

  @ApiProperty({
    description: '검색 결과',
    type: PoopProfileDataDto,
    isArray: true,
    oneOf: [
      { $ref: getSchemaPath(PoopProfileDataDto) },
      {
        $ref: getSchemaPath(PoopBreedDataDto),
      },
    ],
  })
  @Expose()
  list!: PoopProfileDataDto[] | PoopBreedDataDto[];
}
