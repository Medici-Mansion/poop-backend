import { CreateUserDTO, CreateUserResponseDTO } from './dtos/create-user.dto'
import { ConflictException, Injectable } from '@nestjs/common'
import { Users } from './models/users.model'
import { BaseService } from '@/shared/services/base.service'

@Injectable()
export class UsersService extends BaseService {
  constructor() {
    super()
  }

  async createUser(createUserDTO: CreateUserDTO) {
    const repository = this.getManager().getRepository(Users)
    const existUser = await repository.findOne({
      where: {
        accountId: createUserDTO.id,
      },
    })

    if (existUser) {
      throw new ConflictException()
    }
    const { birthday, email, id, password, phone } = createUserDTO
    const newUser = await repository.save(
      repository.create({
        accountId: id,
        password,
        birthday,
        email,
        phone,
      }),
    )

    return new CreateUserResponseDTO(newUser)
  }
}
