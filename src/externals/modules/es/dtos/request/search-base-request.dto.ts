import { ApiProperty } from '@nestjs/swagger'

import { IsEnum, IsString } from 'class-validator'

import { SearchTarget } from '@/externals/modules/es/es.constant'

export class SearchBaseRequestDto {
  @ApiProperty({
    description: `검색 대상 (ES 인덱스명)
    
- poop (prefix: \`poop-\`)
  - poop-breeds: 견종 조회
  - poop-profiles: 프로필 조회
`,
    required: true,
    example: 'poop-profiles',
    enum: SearchTarget,
  })
  @IsEnum(SearchTarget)
  target!: (typeof SearchTarget)[keyof typeof SearchTarget]

  @ApiProperty({
    description: `DB PK ID`,
    required: true,
    type: 'string',
  })
  @IsString()
  id!: string
}
