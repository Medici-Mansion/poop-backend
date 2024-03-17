import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { FindOptionsWhereProperty } from 'typeorm'
import bcrypt from 'bcrypt'

import { Users } from '@/users/models/users.model'

import { BaseService } from '@/shared/services/base.service'
import { RedisService } from '@/redis/redis.service'

import {
  CreateUserDTO,
  CreateUserResponseDTO,
} from '@/users/dtos/create-user.dto'
import { GetUserByVidDTO } from '@/users/dtos/get-user-by-vid.dto'
import { PatchPasswordDTO } from '@/users/dtos/patch-password.dto'

@Injectable()
export class UsersService extends BaseService {
  constructor(private readonly redisService: RedisService) {
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
      where: [
        {
          accountId: createUserDTO.id,
        },
        {
          nickname: createUserDTO.nickname,
        },
        {
          phone: createUserDTO.phone,
        },
        {
          email: createUserDTO.email,
        },
      ],
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

  async changePassword(patchPasswordDTO: PatchPasswordDTO) {
    const { id, key } = await this.redisService.getChangePasswordCode(
      patchPasswordDTO.code,
    )
    if (!id) throw new NotFoundException()
    await this.getManager().update(Users, id, {
      password: await this.hashPassword(patchPasswordDTO.password),
    })

    await this.redisService.removeByKey(key)

    return true
  }

  async getUserByVid(getUserByVidDTO: GetUserByVidDTO) {
    const userWhereCond: FindOptionsWhereProperty<Users> = {
      [getUserByVidDTO.type.toLowerCase()]: getUserByVidDTO.vid,
    }
    const repository = this.getManager().getRepository(Users)
    const foundUser = await repository.findOne({
      where: {
        ...userWhereCond,
      },
    })

    if (!foundUser) {
      throw new NotFoundException()
    }

    return foundUser
  }

  async hashPassword(newPassword: string) {
    return bcrypt.hash(newPassword, 10)
  }
}
