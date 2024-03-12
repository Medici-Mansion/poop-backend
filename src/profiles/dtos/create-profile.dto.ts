import { Gender } from '@/shared/constants/common.constant'
import { IsOnlyDate } from '@/shared/validators/is-date-string.validator'
import { MaxImageSize } from '@/shared/validators/max-image-size.validator'
import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsString } from 'class-validator'
import {
  HasMimeType,
  IsFile,
  MaxFileSize,
  MemoryStoredFile,
} from 'nestjs-form-data'

export class CreateProfileDTO {
  @ApiProperty({
    title: '아바타 이미지파일',
    type: 'string',
    format: 'binary',
    description: '최대 이미지 사이즈 width :320, height : 320',
  })
  @IsFile()
  @MaxFileSize(1e6)
  @HasMimeType(['image/jpeg', 'image/png'])
  @MaxImageSize({ height: 320, width: 320 })
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
    title: '품종',
    deprecated: true,
    description: '픔종 테이블 제작되면 특정품종만 입력 가능하도록 변경 예정',
  })
  @IsString()
  breed: string
}
