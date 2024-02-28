import { CommonModel } from '@/common/models/common.model'
import { Field, InputType, ObjectType, registerEnumType } from '@nestjs/graphql'
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'

export enum PROVIDER {
  KAKAO = 'KAKAO',
  APPLE = 'APPLE',
  GOOGLE = 'GOOGLE',
}

registerEnumType(PROVIDER, {
  name: 'provider',
  description: '어카운드 프로바이더',
})

@ObjectType()
@Entity({ name: 'users' })
export class Users extends CommonModel {
  @Field((type) => String)
  @Column({ comment: '사용자 이름' })
  name: string

  @Field((type) => String)
  @Column({ comment: '사용자 이메일' })
  email: string

  @OneToMany(() => Accounts, (accounts) => accounts.userId, {
    createForeignKeyConstraints: false,
  })
  @Field((type) => [Accounts])
  accounts: Accounts[]
}

@InputType({ isAbstract: true })
@ObjectType()
@Entity({ name: 'accounts' })
export class Accounts extends CommonModel {
  @Field()
  @Column()
  type: string

  @Field((type) => PROVIDER)
  @Column()
  provider: string

  @Field()
  @Column()
  providerAccountId: string

  @Field()
  @Column()
  refreshToken: string

  @Field((type) => String)
  @Column({ name: 'userId', comment: '릴레이션 컬럼' })
  userId: string

  @Field((type) => [Users])
  @ManyToOne(() => Users, (users) => users.accounts, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  users: Users
}
