import { ApiProperty } from '@nestjs/swagger'
import {
  // IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator'

export enum LoginType {
  NICKNAME = 'nickname',
  PHONE = 'phone',
  EMAIL = 'email',
}

export class LoginRequestDTO {
  // TODO: OR조건을 통해 여러가지 타입을 확인하도록 수정됨. 베타 이후 문제생길 경우 수정필요
  // @ApiProperty({
  //   description: '로그인 타입',
  //   enum: LoginType,
  //   example: LoginType.EMAIL,
  // })
  // @IsEnum(LoginType)
  // loginType: LoginType

  @ApiProperty({
    description: '로그인에 사용할 아이디',
    example: 'akdfhr2@gmail.com',
  })
  @IsString()
  id: string

  @ApiProperty({
    description: '사용자 비밀번호',
    example: 'poop!@#123',
    minLength: 6,
    maxLength: 20,
  })
  @IsNotEmpty({ message: '비밀번호는 필수에요.' })
  @MaxLength(20, { message: '비밀번호는 최대 20자까지 가능해요.' })
  @MinLength(6, { message: '비밀번호는 6자 이상이여야 해요.' })
  password: string
}
