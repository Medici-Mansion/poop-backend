import { Database } from '@/database/database.class'
import { CreateUserDTO } from '@/users/dtos/create-user.dto'
import { Inject } from '@nestjs/common'

export class AuthRepository {
  constructor(@Inject(Database) private readonly database: Database) {}

  async findOne(
    createUserDTO: Partial<{
      nickname: string
      phone: string
    }>,
  ) {
    return this.database
      .selectFrom('users')
      .where((eb) =>
        eb.or([
          ...(createUserDTO.nickname
            ? [eb('nickname', '=', createUserDTO.nickname)]
            : []),
          ...(createUserDTO.phone
            ? [eb('phone', '=', createUserDTO.phone)]
            : []),
        ]),
      )
      .selectAll()
      .executeTakeFirst()
  }

  async create(createUserDTO: CreateUserDTO) {
    return this.database
      .insertInto('users')
      .values([{ ...createUserDTO, updatedAt: new Date() }])
      .returning('id')
      .executeTakeFirstOrThrow()
  }
}
