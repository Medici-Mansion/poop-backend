import { InternalServerErrorException } from '@nestjs/common'
import bcrypt from 'bcrypt'
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm'

import { Gender } from '@/shared/constants/common.constants'

import { CommonModel } from '@/shared/models/common.model'
import { Profiles } from '@/profiles/models/profiles.model'

@Entity({ name: 'users' })
export class Users extends CommonModel {
  @Column({ comment: '로그인 시 사용되는 계정', length: 16 })
  accountId: string

  @Column({ comment: '로그인 시 사용되는 비밀번호' })
  password: string

  @Column({
    comment: '사용자 이름, 멀티프로필 관리번호로 사용됩니다 중복불가',
    unique: true,
    length: 16,
  })
  nickname: string

  @Column({ comment: '사용자 이메일', nullable: true })
  email: string

  @Column({ comment: '사용자 전화번호', nullable: true })
  phone: string

  @Column({ type: 'date' })
  birthday: string

  @Column({ type: 'enum', enum: Gender, default: Gender.NONE })
  gender: Gender

  @Column({ type: 'date', nullable: true })
  verified: string

  @OneToMany(() => Profiles, (profiles) => profiles.user, {
    createForeignKeyConstraints: false,
    cascade: true,
  })
  profiles: Profiles[]

  @Column({ comment: '리프레시 토큰', nullable: true })
  refreshToken: string

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      try {
        this.password = await bcrypt.hash(this.password, 10)
      } catch (err) {
        throw new InternalServerErrorException()
      }
    }
  }

  async checkPassword(aPassword: string): Promise<boolean> {
    try {
      const passwordCurrent = await bcrypt.compare(aPassword, this.password)
      return passwordCurrent
    } catch (e) {
      throw new InternalServerErrorException()
    }
  }
}
