import { ApiProperty } from '@nestjs/swagger'

export class Meta {
  @ApiProperty()
  endCursor?: string
  @ApiProperty()
  startCursor?: string

  @ApiProperty()
  hasNextPage: boolean

  @ApiProperty()
  hasPrevPage: boolean
}
