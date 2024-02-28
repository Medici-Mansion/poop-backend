import { ObjectType, Field, ID, Directive } from '@nestjs/graphql'
import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@ObjectType()
@Directive('@key(fields: "id")')
export class CommonModel {
  @PrimaryGeneratedColumn('uuid')
  @Field((type) => ID)
  id: string

  @UpdateDateColumn()
  @Field()
  updatedAt: Date

  @CreateDateColumn()
  @Field()
  createdAt: Date
}
