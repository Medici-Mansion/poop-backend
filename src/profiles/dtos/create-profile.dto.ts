import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsString, IsUUID } from 'class-validator'
import {
  HasMimeType,
  IsFile,
  MaxFileSize,
  MemoryStoredFile,
} from 'nestjs-form-data'

import { Gender } from '@/shared/constants/common.constant'

import { IsOnlyDate } from '@/shared/validators/is-date-string.validator'
import { MaxImageSize } from '@/shared/validators/max-image-size.validator'

export class CreateProfileDTO {
  @ApiProperty({
    title: '아바타 이미지파일',
    type: 'string',
    format: 'binary',
    description: '최대 이미지 사이즈 width :400, height : 400',
  })
  @IsFile()
  @MaxFileSize(1e6)
  @HasMimeType(['image/jpeg', 'image/png'])
  @MaxImageSize({ height: 400, width: 400 })
  avatar: MemoryStoredFile

  @ApiProperty({
    type: String,
    title: '이름',
    description: '프로필 이름',
  })
  @IsString()
  name: string

  @ApiProperty({
    type: String,
    title: '(반려동물) 생일',
    description: '(반려동물) 생일, YYYY-MM-DD 형식',
  })
  @IsOnlyDate({
    message: '잘못된 날짜에요.',
  })
  birthday: string

  @ApiProperty({
    type: 'enum',
    title: '성별',
    description: '성별',
    enum: Gender,
  })
  @IsEnum(Gender)
  gender: Gender

  @ApiProperty({
    type: String,
    title: '견종 아이디',
    description: '견종 데이터 아이디',
  })
  @IsUUID()
  breedId: string
}
