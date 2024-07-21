import { Database } from '@/database/database.class'
import { User, verification } from '@/database/types'

import { Inject } from '@nestjs/common'
import { Insertable, Selectable, Updateable } from 'kysely'
import { jsonObjectFrom } from 'kysely/helpers/postgres'

export class VerificationsRepository {
  constructor(@Inject(Database) private readonly database: Database) {}

  async create(createVerificationDTO: Insertable<verification>) {
    return this.database
      .insertInto('verification')
      .values(createVerificationDTO)
      .returning(['id', 'code'])
      .executeTakeFirstOrThrow()
  }

  async delete(id: string) {
    return this.database
      .deleteFrom('verification')
      .where('id', '=', id)
      .returning('id')
      .executeTakeFirstOrThrow()
  }

  async update(id: string, updateVerificationsDTO: Updateable<verification>) {
    return this.database
      .updateTable('verification')
      .where('id', '=', id)
      .set(updateVerificationsDTO)
      .returning(['code', 'id', 'userId'])
      .executeTakeFirstOrThrow()
  }

  async findOneBy<K extends keyof verification>(
    key: K,
    value: Selectable<verification>[K],
  ) {
    return this.database
      .selectFrom('verification')
      .where(key, '=', value as any)
      .selectAll()
      .executeTakeFirst()
  }

  async findOneByUserVid<K extends keyof User>(
    key: K,
    value: Selectable<User>[K],
  ) {
    return this.database
      .with('v', (db) =>
        db
          .selectFrom('verification as v')
          .leftJoin('users', 'users.id', 'v.userId')
          .select([
            'users.id as users_id',
            // 'users.accountId as users_accountId',
            'users.nickname as users_nickname',
            // 'users.email as users_email',
            'users.birthday as users_birthday',
            // 'users.gender as users_gender',
            'users.verified as users_verified',
            'users.latestProfileId as users_latestProfileId',
            'users.createdAt as users_createdAt',
            'v.id',
            'v.code',
            'v.userId',
          ])
          .where(({ and, eb }) =>
            and([
              eb(`users.${key}`, '=', value as any),
              eb('users.verified', 'is', null),
            ]),
          ),
      )
      .selectFrom('v')
      .select([
        'v.id',
        'v.code',
        'v.userId',
        (qb) =>
          jsonObjectFrom(
            qb.selectFrom('v').select([
              // 'v.users_accountId as accountId',
              'v.users_nickname as nickname',
              // 'v.users_email as email ',
              'v.users_birthday as birthday',
              // 'v.users_gender as gender',
              'v.users_verified as verified',
              'v.users_latestProfileId as latestProfileId',
              'v.users_createdAt as createdAt',
            ]),
          ).as('user'),
      ])
      .executeTakeFirst()
  }
}
