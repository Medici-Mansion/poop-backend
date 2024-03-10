import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { Users } from '@/users/models/users.model'
import { BaseService } from '@/shared/services/base.service'

import {
  CreateUserDTO,
  CreateUserResponseDTO,
} from '@/users/dtos/create-user.dto'

@Injectable()
export class UsersService extends BaseService {
  constructor() {
    super()
  }

  async getUserById(id: string) {
    const foundUser = await this.getManager()
      .getRepository(Users)
      .findOne({
        where: {
          id,
        },
        relations: {
          latestJoinProfile: true,
        },
      })

    if (!foundUser) throw new NotFoundException()

    return foundUser
  }

  async getUserByAccountId(accountId: string) {
    const foundUser = await this.getManager().getRepository(Users).findOne({
      where: {
        accountId,
      },
    })

    if (!foundUser) throw new NotFoundException()

    return foundUser
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
    const { id, ...newUserData } = createUserDTO
    const newUser = await repository.save(
      repository.create({
        accountId: id,
        ...newUserData,
      }),
    )

    return new CreateUserResponseDTO(newUser)
  }
}
