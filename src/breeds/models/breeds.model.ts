import { CommonModel } from '@/shared/models/common.model'
import { Column, Entity, ViewColumn, ViewEntity } from 'typeorm'

@Entity()
export class Breeds extends CommonModel {
  @Column({ comment: '이름' })
  name: string

  @Column({ comment: '아바타 이미지 주소', nullable: true })
  avatar: string
}

@ViewEntity({
  expression: `
    select
    "b"."id" as "id",
    "b"."createdAt" as "createdAt",
    "b"."updatedAt" as "updatedAt",
    "b"."deletedAt" as "deletedAt",
    "b"."name" as "name",
    "b"."avatar" as "avatar",
    "development".get_choseong("b"."name") as "searchKey"
    from
    "development"."breeds" "b"
  `,
})
export class SearchBreeds {
  @ViewColumn()
  id: string

  @ViewColumn()
  createdAt: Date

  @ViewColumn()
  updatedAt: Date

  @ViewColumn()
  deletedAt: Date

  @ViewColumn()
  name: string

  @ViewColumn()
  avatar: string

  @ViewColumn()
  searchKey: string
}
