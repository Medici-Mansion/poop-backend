import { Gender } from '@/shared/constants/common.constant'
import { CommonModel } from '@/shared/models/common.model'
import { Users } from '@/users/models/users.model'

import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'

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
  @Column({ comment: '반려동물 품종' })
  breed: string

  @Column({ comment: '프로필과 매핑된 사용자 아이디' })
  userId: string

  @ManyToOne((type) => Users, (users) => users.nickname, {
    onDelete: 'CASCADE',
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: Users
}
