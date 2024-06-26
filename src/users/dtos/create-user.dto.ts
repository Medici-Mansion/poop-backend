import { ApiProperty } from '@nestjs/swagger'
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
} from 'class-validator'
import { Transform } from 'class-transformer'

import { IsAccountId } from '@/shared/validators/is-account-id.validator'
import { IsAccountPassword } from '@/shared/validators/is-account-password.validator'
import { IsOnlyDate } from '@/shared/validators/is-date-string.validator'
import { IsUserId } from '@/shared/validators/is-user-id.validator'
import { IsYYYYMMDD } from '@/shared/validators/is-YYYY-MM-DD.validator'

import { Gender } from '@/shared/constants/common.constant'

interface CreateUserArgs {
  id: string
  createdAt: Date
  updatedAt: Date
  deletedAt: Date
  accountId: string
  password: string
  nickname: string
  email: string
  phone: string
  birthday: Date
  gender: Gender
  verified: Date
  refreshToken: string
  latestProfileId: string
}

export class CreateUserDTO {
  @IsAccountId()
  id: string
  @IsAccountPassword()
  password: string

  @ApiProperty({
    description: '사용자 생일',
    example: '1995-01-04',
  })
  @IsOnlyDate({
    message: '잘못된 날짜에요.',
  })
  birthday: string

  @ApiProperty({
    description: '사용자 성명',
    example: '댕댕이',
  })
  @IsString({ message: '닉네임은 필수에요.' })
  @MaxLength(16, { message: '닉네임은 16글자 이상으로 작성할 수 없어요.' })
  nickname: string

  @ApiProperty({
    description: '사용자 성별',
    type: Gender,
    enum: Gender,
  })
  @IsEnum(Gender, { message: '유효하지 않은 성별이에요.' })
  gender: Gender

  @ApiProperty({
    description: '사용자 전화번호',
    example: '01093367663',
    nullable: true,
  })
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsOptional()
  @IsPhoneNumber('KR', { message: '유효하지 않은 번호에요.' })
  phone: string

  @ApiProperty({
    description: '사용자 이메일',
    example: 'akdfhr2@gmail.com',
    nullable: true,
  })
  @Transform(({ value }) => (value === '' ? null : value))
  @IsOptional()
  @IsEmail({}, { message: '유효하지 않은 이메일이에요.' })
  email: string
}

export class CreateUserResponseDTO {
  @IsUserId()
  id: string

  @ApiProperty({
    description: '사용자 아이디',
    example: 'poopcoco123',
    maxLength: 16,
    minLength: 6,
  })
  @IsNotEmpty({ message: '아이디는 필수에요.' })
  accountId: string

  @IsYYYYMMDD()
  birthday: Date

  constructor(user: CreateUserArgs) {
    this.id = user.id
    this.accountId = user.accountId
    this.birthday = user.birthday
  }
}
