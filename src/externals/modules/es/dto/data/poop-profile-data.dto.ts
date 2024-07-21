import { Exclude, Expose } from 'class-transformer'
import { EsBaseDataDto } from './es-base-data.dto'
import { IsString } from 'class-validator'
import { ApiProperty, OmitType } from '@nestjs/swagger'

/**
 * https://github.com/Medici-Mansion/elasticsearch/blob/main/index/poop-profiles.v1.es
 */
@Exclude()
export class PoopProfileDataDto extends OmitType(EsBaseDataDto, ['deletedAt']) {
  @ApiProperty({
    type: 'string',
  })
  @Expose()
  @IsString()
  name!: string

  @ApiProperty({
    type: 'string',
  })
  @Expose()
  @IsString()
  avatarUrl!: string

  @ApiProperty({
    type: 'string',
  })
  @Expose()
  @IsString()
  birthday!: string

  @ApiProperty({
    type: 'string',
  })
  @Expose()
  @IsString()
  breedId!: string

  @ApiProperty({
    type: 'string',
  })
  @Expose()
  @IsString()
  userId!: string
}
