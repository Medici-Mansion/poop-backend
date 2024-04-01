import { CommonModel } from '@/shared/models/common.model'
import { Column, Entity, ViewColumn, ViewEntity } from 'typeorm'

@Entity()
export class Breeds extends CommonModel {
  @Column({ comment: '이름', nullable: true })
  nameKR: string

  @Column({ comment: '이름', nullable: true })
  nameEN: string

  @Column({ comment: '아바타 이미지 주소', nullable: true })
  avatar: string

  @Column({ comment: 'FCI 분류 그룹', nullable: true })
  group: number
}

@ViewEntity({
  expression: `
    WITH search_keys AS (
        SELECT
            "b"."id",
            "b"."createdAt",
            "b"."updatedAt",
            "b"."deletedAt",
            "b"."nameKR",
            "b"."nameEN",
            "b"."avatar",
            get_choseong("b"."nameKR") AS "searchKey"
        FROM
            "breeds" "b"
    )
    SELECT
        "id",
        "createdAt",
        "updatedAt",
        "deletedAt",
        "nameKR",
        "nameEN",
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
  nameKR: string

  @ViewColumn()
  nameEN: string

  @ViewColumn()
  avatar: string

  @ViewColumn()
  searchKey: string

  @ViewColumn()
  searchKeyCode: number
}
