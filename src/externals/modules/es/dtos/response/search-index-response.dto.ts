import {
  ApiExtraModels,
  ApiProperty,
  getSchemaPath,
  PickType,
} from '@nestjs/swagger'
import { PoopProfileDataDto } from '@/externals/modules/es/dto/data/poop-profile-data.dto'
import { PoopBreedDataDto } from '@/externals/modules/es/dto/data/poop-breed-data.dto'
import { IsNotEmpty, ValidateNested } from 'class-validator'
import { Exclude, Expose, Type } from 'class-transformer'
import { SearchBaseRequestDto } from '../request/search-base-request.dto'

@ApiExtraModels(PoopProfileDataDto, PoopBreedDataDto)
@Exclude()
export class SearchIndexResponseDto extends PickType(SearchBaseRequestDto, [
  'target',
]) {
  @ApiProperty({
    description: '색인 데이터',
    type: PoopProfileDataDto,
    oneOf: [
      { $ref: getSchemaPath(PoopProfileDataDto) },
      {
        $ref: getSchemaPath(PoopBreedDataDto),
      },
    ],
  })
  @Type(() => Object, {
    discriminator: {
      property: 'target',
      subTypes: [
        { value: PoopBreedDataDto, name: 'poop-breeds' },
        { value: PoopProfileDataDto, name: 'poop-profiles' },
      ],
    },
    keepDiscriminatorProperty: true,
  })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Expose()
  targetData!: PoopProfileDataDto | PoopBreedDataDto
}
