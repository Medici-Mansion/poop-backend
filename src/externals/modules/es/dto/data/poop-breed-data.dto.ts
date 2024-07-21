import { Exclude, Expose } from 'class-transformer'
import { EsBaseDataDto } from './es-base-data.dto'
import { IsString } from 'class-validator'
import { ApiProperty, OmitType } from '@nestjs/swagger'

/**
 * https://github.com/Medici-Mansion/elasticsearch/blob/main/index/poop-breeds.v1.es
 */
@Exclude()
export class PoopBreedDataDto extends OmitType(EsBaseDataDto, ['deletedAt']) {
  @ApiProperty({
    type: 'string',
  })
  @Expose()
  @IsString()
  nameKR!: string

  @ApiProperty({
    type: 'string',
  })
  @Expose()
  @IsString()
  nameEN!: string

  @ApiProperty({
    type: 'string',
  })
  @Expose()
  @IsString()
  avatar!: string
}
