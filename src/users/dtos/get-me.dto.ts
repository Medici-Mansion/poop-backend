import { Gender } from '@/database/enums'
import { User } from '@/database/types'
import { IsAccountId } from '@/shared/validators/is-account-id.validator'
import { IsOnlyDate } from '@/shared/validators/is-date-string.validator'
import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import {
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
} from 'class-validator'
import dayjs from 'dayjs'
import { Selectable } from 'kysely'

export class GetMeResponseDTO {
  @IsAccountId()
  id: string

  @ApiProperty({ title: '최근 접속한 프로필 아이디', nullable: true })
  latestProfileId?: string | null

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
  phone: string | null

  // @ApiProperty({
  //   description: '사용자 이메일',
  //   example: 'akdfhr2@gmail.com',
  //   nullable: true,
  // })
  // @Transform(({ value }) => (value === '' ? null : value))
  // @IsOptional()
  // @IsEmail({}, { message: '유효하지 않은 이메일이에요.' })
  // email?: string | null

  @ApiProperty({
    description: '인증 일자',
    example: new Date(),
    nullable: true,
  })
  @IsOptional()
  verified: Date | null

  constructor(user: Selectable<User>) {
    this.id = user.id
    this.birthday = dayjs(user.birthday).format('YYYY-MM-DD')
    this.nickname = user.nickname
    this.phone = user.phone
    this.verified = user.verified
    this.latestProfileId = user.latestProfileId
  }
}
