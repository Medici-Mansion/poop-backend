import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm'

import { Gender } from '@/shared/constants/common.constant'

import { Breeds } from '@/breeds/models/breeds.model'
import { CommonModel } from '@/shared/models/common.model'
import { Users } from '@/users/models/users.model'

export interface ProfilesFields {
  userId: string
  avatarUrl: string
  name: string
  birthday: string
  gender: Gender
  breedId: string
}

@Entity()
export class Profiles extends CommonModel {
  @Column({ nullable: true, comment: '프로필 메인 아바타 이미지 주소' })
  avatarUrl: string

  @Column({ length: 13, comment: '프로필 이름' })
  name: string

  @Column({ type: 'timestamp', comment: '프로필 생일 ( 반려동물 생일 )' })
  birthday: string

  @Column({
    type: 'enum',
    enum: Gender,
    default: Gender.NONE,
    comment: '프로필(반려동물) 성별',
  })
  gender: Gender

  // TODO: 릴레이션을 통한 품종 1:N 매핑 필요
  @Column({ comment: '반려동물 품종 아이디' })
  breedId: string

  @Column({ comment: '프로필과 매핑된 사용자 아이디' })
  userId: string

  @OneToOne((type) => Breeds, {
    createForeignKeyConstraints: false,
  })
  breed: Breeds

  @ManyToOne((type) => Users, (users) => users.nickname, {
    onDelete: 'CASCADE',
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: Users

  static of({
    avatarUrl,
    birthday,
    breedId,
    gender,
    name,
    userId,
  }: ProfilesFields) {
    const profile = new Profiles()
    profile.userId = userId
    profile.avatarUrl = avatarUrl
    profile.name = name
    profile.birthday = birthday
    profile.gender = gender
    profile.breedId = breedId
    return profile
  }
}
