import { Database } from '@/database/database.class'
import { Profile } from '@/database/types'
import { Inject } from '@nestjs/common'
import { Insertable } from 'kysely'
import { jsonObjectFrom } from 'kysely/helpers/postgres'

export class ProfilesRepository {
  constructor(@Inject(Database) private readonly database: Database) {}

  async create(createProfilesDTO: Insertable<Profile>) {
    return this.database
      .insertInto('profiles')
      .values(createProfilesDTO)
      .returningAll()
      .executeTakeFirst()
  }

  async findByUserId(userId: string) {
    return this.database
      .selectFrom('profiles')
      .selectAll('profiles')
      .select((eb) => [
        jsonObjectFrom(
          eb
            .selectFrom('users as u')
            .selectAll()
            .whereRef('u.id', '=', 'profiles.userId'),
        ).as('user'),
      ])
      .where('userId', '=', userId)
      .execute()
  }
}
