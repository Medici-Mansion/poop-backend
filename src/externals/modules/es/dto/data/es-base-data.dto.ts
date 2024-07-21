import { Exclude, Expose } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator'

@Exclude()
export class EsBaseDataDto {
  @ApiProperty({
    description: 'db pk id',
    type: 'string',
    required: true,
  })
  @IsUUID()
  @IsNotEmpty()
  @Expose()
  id!: string

  @ApiProperty({
    description: '생성일',
    type: 'string',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Expose()
  createdAt!: string

  @ApiProperty({
    description: '수정일',
    type: 'string',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Expose()
  updatedAt!: string

  @ApiProperty({
    description: '삭제일',
    type: 'string',
    required: false,
  })
  @IsOptional()
  @Expose()
  deletedAt?: string;

  @ApiProperty({
    description: '색인 시간',
    type: 'string',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Expose()
  [`@timestamp`]!: string
}
