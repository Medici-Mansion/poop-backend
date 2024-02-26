import { ObjectType, Field, ID, Directive } from '@nestjs/graphql'
import { CreateDateColumn, PrimaryColumn, UpdateDateColumn } from 'typeorm'

@ObjectType()
@Directive('@key(fields: "id")')
export class CommonEntity {
  @PrimaryColumn({ type: 'uuid' })
  @Field((type) => ID)
  id: string

  @UpdateDateColumn()
  @Field()
  updatedAt: Date

  @CreateDateColumn()
  @Field()
  createdAt: Date
}
