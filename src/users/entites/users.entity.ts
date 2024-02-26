import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'
import { Column, Entity } from 'typeorm'
import { RolesEnum } from '@/users/const/roles.const'
import { CommonEntity } from '@/common/entities/common.entity'

registerEnumType(RolesEnum, { name: 'UserRole' })

@ObjectType()
@Entity()
export class Users extends CommonEntity {
  @Column({
    length: 20,
    unique: true,
  })
  @Field((type) => String)
  nickname: string

  @Column({
    unique: true,
  })
  @Field((type) => String)
  email: string

  @Column()
  @Field((type) => String)
  password: string

  @Column({
    enum: Object.values(RolesEnum),
    default: RolesEnum.USER,
  })
  @Field((type) => RolesEnum)
  role: RolesEnum
}
