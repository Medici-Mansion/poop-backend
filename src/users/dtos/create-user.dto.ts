import { IsOnlyDate } from '@/shared/validators/is-date-string.validator'
import { ApiProperty } from '@nestjs/swagger'
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator'
import { Users } from '@/users/models/users.model'

export class CreateUserDTO {
  @ApiProperty({
    description: '사용자 아이디',
    example: 'poopcoco123',
    maxLength: 16,
    minLength: 6,
  })
  @IsNotEmpty({ message: '아이디는 필수에요.' })
  @Matches(/^[A-Za-z0-9]*$/, {
    message: '아이디에 특수문자를 사용할 수 없어요.',
  })
  @MaxLength(16, { message: '아이디는 최대 16자까지 가능해요.' })
  @MinLength(6, { message: '아이디는 6자 이상이여야 해요.' })
  id: string

  @ApiProperty({
    description: '사용자 비밀번호',
    example: 'poop!@#123',
    minLength: 6,
    maxLength: 16,
  })
  @IsNotEmpty({ message: '비밀번호는 필수에요.' })
  @MaxLength(16, { message: '비밀번호는 최대 16자까지 가능해요.' })
  @MinLength(6, { message: '비밀번호는 6자 이상이여야 해요.' })
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
