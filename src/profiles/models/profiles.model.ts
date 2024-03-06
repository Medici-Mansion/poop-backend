import { Gender } from '@/shared/constants/common.constants'
import { CommonModel } from '@/shared/models/common.model'
import { Users } from '@/users/models/users.model'

import { Column, Entity, ManyToOne } from 'typeorm'

@Entity()
export class Profiles extends CommonModel {
  @Column({ nullable: true })
  avatarUrl: string

  @Column({ length: 12 })
  name: string

  @Column({ type: 'timestamp' })
  birthday: string

  @Column({ type: 'enum', enum: Gender, default: Gender.NONE })
  gender: Gender

  // TODO: 릴레이션을 통한 품종 1:N 매핑 필요
  @Column()
  breed: string

  @Column({ type: 'uuid' })
  userId: string

  @ManyToOne((type) => Users, { onDelete: 'CASCADE' })
  user: Users
}
