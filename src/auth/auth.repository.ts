import { Database } from '@/database/database.class'
import { CreateUserDTO } from '@/users/dtos/create-user.dto'
import { Inject } from '@nestjs/common'

export class AuthRepository {
  constructor(@Inject(Database) private readonly database: Database) {}

  async findOne(createUserDTO: CreateUserDTO) {
    return this.database
      .selectFrom('users')
      .where((eb) =>
        eb.or([
          eb('accountId', '=', createUserDTO.id),
          eb('nickname', '=', createUserDTO.nickname),
          eb('phone', '=', createUserDTO.phone),
          eb('email', '=', createUserDTO.email),
        ]),
      )
      .selectAll()
      .executeTakeFirst()
  }

  async create(createUserDTO: CreateUserDTO & { password: string }) {
    const { id, ...newUserData } = createUserDTO

    return this.database
      .insertInto('users')
      .values([{ accountId: id, ...newUserData, updatedAt: new Date() }])
      .returning('id')
      .executeTakeFirstOrThrow()
  }
}
