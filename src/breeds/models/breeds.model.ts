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
    WITH search_keys AS (
        SELECT
            "b"."id",
            "b"."createdAt",
            "b"."updatedAt",
            "b"."deletedAt",
            "b"."name",
            "b"."avatar",
            get_choseong("b"."name") AS "searchKey"
        FROM
            "breeds" "b"
    )
    SELECT
        "id",
        "createdAt",
        "updatedAt",
        "deletedAt",
        "name",
        "avatar",
        "searchKey",
        ascii("searchKey") AS "searchKeyCode"
    FROM
        search_keys;
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

  @ViewColumn()
  searchKeyCode: number
}
