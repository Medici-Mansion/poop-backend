import { CommonModel } from '@/common/models/common.model'
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm'
import bcrypt from 'bcrypt'
import { InternalServerErrorException } from '@nestjs/common'
import { Gender } from '@/common/common.const'
import { Profiles } from '@/profiles/models/profiles.model'

@Entity({ name: 'users' })
export class Users extends CommonModel {
  @Column({ comment: '사용자 이름' })
  name: string

  @Column({ comment: '로그인 시 사용되는 계정', length: 16 })
  accountId: string

  @Column({ comment: '로그인 시 사용되는 비밀번호', length: 16 })
  password: string

  @Column({ comment: '사용자 이메일', nullable: true })
  email: string

  @Column({ comment: '사용자 전화번호', nullable: true })
  phone: string

  @Column({ type: 'timestamp' })
  birthday: string

  @Column({ type: 'enum', enum: Gender, default: Gender.NONE })
  gender: Gender

  @Column({ default: false })
  verified: boolean

  @OneToMany(() => Profiles, (profiles) => profiles.user)
  profiles: Profiles[]

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
