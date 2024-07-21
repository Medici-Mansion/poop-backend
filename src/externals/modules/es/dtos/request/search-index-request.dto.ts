import {
  ApiExtraModels,
  ApiProperty,
  getSchemaPath,
  PickType,
} from '@nestjs/swagger'
import { SearchBaseRequestDto } from './search-base-request.dto'
import { PoopProfileDataDto } from '@/externals/modules/es/dto/data/poop-profile-data.dto'
import { PoopBreedDataDto } from '@/externals/modules/es/dto/data/poop-breed-data.dto'
import { IsObject } from 'class-validator'
import { Type } from 'class-transformer'

@ApiExtraModels(PoopProfileDataDto, PoopBreedDataDto)
export class SearchIndexRequestDto extends PickType(SearchBaseRequestDto, [
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
  @IsObject()
  targetData!: PoopProfileDataDto | PoopBreedDataDto
}
