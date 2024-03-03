import { CommonModel } from '@/common/models/common.model'
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'

export enum PROVIDER {
  KAKAO = 'KAKAO',
  APPLE = 'APPLE',
  GOOGLE = 'GOOGLE',
}

@Entity({ name: 'users' })
export class Users extends CommonModel {
  @Column({ comment: '사용자 이름' })
  name: string

  @Column({ comment: '사용자 이메일' })
  email: string

  @OneToMany(() => Accounts, (accounts) => accounts.userId, {
    createForeignKeyConstraints: false,
  })
  accounts: Accounts[]
}

@Entity({ name: 'accounts' })
export class Accounts extends CommonModel {
  @Column()
  type: string

  @Column()
  provider: string

  @Column()
  providerAccountId: string

  @Column()
  refreshToken: string

  @Column({ name: 'userId', comment: '릴레이션 컬럼' })
  userId: string

  @ManyToOne(() => Users, (users) => users.accounts, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  users: Users
}
