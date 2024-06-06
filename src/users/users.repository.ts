import { Database } from '@/database/database.class'
import { DB, User } from '@/database/types'
import { Inject } from '@nestjs/common'
import { ExpressionOrFactory, SqlBool, Updateable } from 'kysely'

import { jsonObjectFrom } from 'kysely/helpers/postgres'

export class UsersRepository {
  constructor(@Inject(Database) private readonly database: Database) {}

  async update(id: string, updateUserDTO: Updateable<User>) {
    return this.database
      .updateTable('users')
      .where('id', '=', id)
      .set(updateUserDTO)
      .returning('id')
      .executeTakeFirstOrThrow()
  }

  findOne(eb: ExpressionOrFactory<DB, 'users', SqlBool>): Promise<unknown>
  findOne(id: string): Promise<unknown>
  async findOne(
    id: ExpressionOrFactory<DB, 'users', SqlBool> | string,
  ): Promise<unknown> {
    if (typeof id === 'string') {
      const result = await this.database
        .selectFrom('users')
        .selectAll('users')
        .select((eb) => [
          jsonObjectFrom(
            eb
              .selectFrom('profiles as latestProfile')
              .whereRef('latestProfile.id', '=', 'users.latestProfileId'),
          ).as('latestProfile'),
        ])
        .where('users.id', '=', id)
        .executeTakeFirstOrThrow()
      return result
    }

    return this.database
      .selectFrom('users')
      .selectAll('users')
      .select((eb) => [
        jsonObjectFrom(
          eb
            .selectFrom('profiles as latestProfile')
            .whereRef('latestProfile.id', '=', 'users.latestProfileId'),
        ).as('latestProfile'),
      ])
      .where(id)
      .selectAll()
      .executeTakeFirstOrThrow()
  }
}
