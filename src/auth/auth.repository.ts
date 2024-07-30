import { Database } from '@/database/database.class'
import { User } from '@/database/types'
import { Inject } from '@nestjs/common'
import { Insertable } from 'kysely'

export class AuthRepository {
  constructor(@Inject(Database) private readonly database: Database) {}

  async findOne(
    createUserDTO: Partial<{
      userId: string
      phone: string
    }>,
  ) {
    return this.database
      .selectFrom('users')
      .where((eb) =>
        eb.or([
          ...(createUserDTO.userId
            ? [eb('userId', '=', createUserDTO.userId)]
            : []),
          ...(createUserDTO.phone
            ? [eb('phone', '=', createUserDTO.phone)]
            : []),
        ]),
      )
      .selectAll()
      .executeTakeFirst()
  }

  async create(createUserDTO: Insertable<User>) {
    return this.database
      .insertInto('users')
      .values([{ ...createUserDTO, updatedAt: new Date() }])
      .returning(['id', 'phone'])
      .executeTakeFirstOrThrow()
  }
}
