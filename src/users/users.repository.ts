import { Database } from '@/database/database.class'
import { User } from '@/database/types'
import { ResultCode } from '@/shared/errors/dtos/resultCode.dto'
import { UserException } from '@/shared/exceptions/user.exception'
import { VerificationType } from '@/verifications/dtos/verify-code.dto'
import { Inject } from '@nestjs/common'
import { Selectable, Updateable } from 'kysely'

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

  async findOne(id: string) {
    const result = await this.database
      .selectFrom('users')
      .selectAll('users')
      .select((eb) => [
        jsonObjectFrom(
          eb
            .selectFrom('profiles as latestProfile')
            .selectAll('latestProfile')
            .whereRef('latestProfile.id', '=', 'users.latestProfileId'),
        ).as('latestProfile'),
      ])
      .where('users.id', '=', id)
      .executeTakeFirstOrThrow(
        () => new UserException(new ResultCode(400, 1002, '')),
      )
    return result
  }

  async findByVid(type: VerificationType, vid: string) {
    return this.database
      .selectFrom('users')
      .selectAll()
      .where(type, '=', vid)
      .executeTakeFirst()
  }

  async findOneBy<K extends keyof User>(key: K, value: Selectable<User>[K]) {
    value
    return this.database
      .selectFrom('users')
      .selectAll()
      .where(key, '=', value as any)
      .executeTakeFirst()
  }
}
