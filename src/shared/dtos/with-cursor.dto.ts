import { ApiProperty } from '@nestjs/swagger'

export class Meta {
  @ApiProperty({ nullable: true })
  nextCursor: string | null

  @ApiProperty()
  hasNextPage: boolean
}

export class WithCursor<T = any> {
  @ApiProperty()
  data: T[]

  @ApiProperty()
  meta: Meta

  constructor(data: T[], meta: Meta) {
    this.data = data
    this.meta = meta
  }
}
