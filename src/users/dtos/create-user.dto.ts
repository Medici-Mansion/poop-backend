import { IsOnlyDate } from '@/shared/validators/is-date-string.validator'
import { ApiProperty } from '@nestjs/swagger'
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsUUID,
} from 'class-validator'
import { Users } from '@/users/models/users.model'
import { IsAccountId } from '@/shared/validators/is-account-id.validator'
import { IsAccountPassword } from '@/shared/validators/is-account-password.validator'

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
    description: '사용자 전화번호',
    example: '010-9336-7663',
  })
  @IsOptional()
  @IsPhoneNumber('KR', { message: '유효하지 않은 번호에요.' })
  phone: string

  @ApiProperty({
    description: '사용자 이메일',
    example: 'akdfhr2@gmail.com',
  })
  @IsOptional()
  @IsEmail({}, { message: '유효하지 않은 번호에요.' })
  email: string
}

export class CreateUserResponseDTO {
  @ApiProperty({
    description: '사용자 PK',
    example: 'poopcoco123',
    maxLength: 16,
    minLength: 6,
  })
  @IsNotEmpty()
  @IsUUID('all')
  id: string

  @ApiProperty({
    description: '사용자 아이디',
    example: 'poopcoco123',
    maxLength: 16,
    minLength: 6,
  })
  @IsNotEmpty({ message: '아이디는 필수에요.' })
  accountId: string

  @ApiProperty({
    description: '사용자 생일',
    example: '1995-01-04',
  })
  @IsOnlyDate({
    message: '잘못된 날짜에요.',
  })
  birthday: string

  @ApiProperty({
    description: '사용자 전화번호',
    example: '010-9336-7663',
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

  constructor(user: Users) {
    this.id = user.id
    this.accountId = user.accountId
    this.birthday = user.birthday
    this.email = user.email
    this.phone = user.phone
  }
}
