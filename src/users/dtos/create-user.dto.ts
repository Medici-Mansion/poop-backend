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

import { Users } from '@/users/models/users.model'

import { IsAccountId } from '@/shared/validators/is-account-id.validator'
import { IsAccountPassword } from '@/shared/validators/is-account-password.validator'
import { IsOnlyDate } from '@/shared/validators/is-date-string.validator'
import { IsUserId } from '@/shared/validators/is-user-id.validator'
import { IsYYYYMMDD } from '@/shared/validators/is-YYYY-MM-DD.validator'
import { Gender } from '@/shared/constants/common.constant'

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
  @IsOptional()
  @IsPhoneNumber('KR', { message: '유효하지 않은 번호에요.' })
  phone: string

  @ApiProperty({
    description: '사용자 이메일',
    example: 'akdfhr2@gmail.com',
    nullable: true,
  })
  @IsOptional()
  @IsEmail({}, { message: '유효하지 않은 번호에요.' })
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
  birthday: string

  constructor(user: Users) {
    this.id = user.id
    this.accountId = user.accountId
    this.birthday = user.birthday
  }
}
