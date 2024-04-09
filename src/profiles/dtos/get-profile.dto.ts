import { ApiProperty } from '@nestjs/swagger'
import { IsEnum } from 'class-validator'

import { IsYYYYMMDD } from '@/shared/validators/is-YYYY-MM-DD.validator'
import { IsUserId } from '@/shared/validators/is-user-id.validator'

import { $Enums } from '@prisma/client'

interface GetProfileArgs {
  id: string
  createdAt: Date
  updatedAt: Date
  avatarUrl: string | null
  name: string
  birthday: Date
  gender: $Enums.Gender
  breedId: string
  latestProfileId?: string
}

export class ProfileDTO {
  @IsUserId()
  id: string

  @IsYYYYMMDD()
  createdAt: Date

  @IsYYYYMMDD()
  updatedAt: Date

  @ApiProperty({ title: '프로필 메인 아바타 이미지 주소', nullable: true })
  avatarUrl: string | null

  @ApiProperty({ title: '프로필 이름' })
  name: string

  @ApiProperty({ title: '프로필 생일 (반려동물 생일)' })
  @IsYYYYMMDD()
  birthday: Date

  @ApiProperty({
    type: 'enum',
    title: '성별',
    description: '성별',
    enum: $Enums.Gender,
  })
  @IsEnum($Enums.Gender)
  gender: $Enums.Gender

  @ApiProperty({ title: '품종 아이디' })
  breedId: string

  constructor(getProfileArgs: GetProfileArgs) {
    this.id = getProfileArgs.id
    this.createdAt = getProfileArgs.createdAt
    this.updatedAt = getProfileArgs.updatedAt
    this.avatarUrl = getProfileArgs.avatarUrl
    this.name = getProfileArgs.name
    this.birthday = getProfileArgs.birthday
    this.gender = getProfileArgs.gender
    this.breedId = getProfileArgs.breedId
  }
}

export class GetProfileDTO extends ProfileDTO {
  @ApiProperty({ title: '최근 접속한 프로필 여부' })
  isLatestLoginProfile: boolean
  constructor(getProfileArgs: GetProfileArgs) {
    super(getProfileArgs)
    getProfileArgs.avatarUrl
    this.isLatestLoginProfile = !!(
      getProfileArgs.latestProfileId &&
      getProfileArgs.latestProfileId === getProfileArgs.id
    )
  }
}
