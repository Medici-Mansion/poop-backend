import { ApiProperty } from '@nestjs/swagger'
import { IsEnum } from 'class-validator'

import { Profiles } from '@/profiles/models/profiles.model'

import { IsYYYYMMDD } from '@/shared/validators/is-YYYY-MM-DD.validator'
import { IsUserId } from '@/shared/validators/is-user-id.validator'
import { Gender } from '@/shared/constants/common.constant'

export class ProfileDTO {
  @IsUserId()
  id: string

  @IsYYYYMMDD()
  createdAt: Date

  @IsYYYYMMDD()
  updatedAt: Date

  @ApiProperty({ title: '프로필 메인 아바타 이미지 주소' })
  avatarUrl: string

  @ApiProperty({ title: '프로필 이름' })
  name: string

  @ApiProperty({ title: '프로필 생일 (반려동물 생일)' })
  @IsYYYYMMDD()
  birthday: string

  @ApiProperty({
    type: 'enum',
    title: '성별',
    description: '성별',
    enum: Gender,
  })
  @IsEnum(Gender)
  gender: Gender

  @ApiProperty({ title: '품종' })
  breed: string

  @ApiProperty({ title: '최근 접속한 프로필 여부' })
  isLatestLoginProfile: boolean

  constructor(profile: Profiles & { isLatestLoginProfile?: boolean }) {
    this.id = profile.id
    this.createdAt = profile.createdAt
    this.updatedAt = profile.updatedAt
    this.avatarUrl = profile.avatarUrl
    this.name = profile.name
    this.birthday = profile.birthday
    this.gender = profile.gender
    this.breed = profile.breed
    this.isLatestLoginProfile = profile.isLatestLoginProfile
  }
}

export class GetProfileDTO extends ProfileDTO {
  constructor(profile: Profiles) {
    super(profile)
    this.isLatestLoginProfile = !!(
      profile?.user?.latestProfileId &&
      profile.user.latestProfileId === profile.id
    )
  }
}
