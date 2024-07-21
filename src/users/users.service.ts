import { Injectable, NotFoundException } from '@nestjs/common'
import bcrypt from 'bcrypt'

import { RedisService } from '@/redis/redis.service'

import { GetUserByVidDTO } from '@/users/dtos/get-user-by-vid.dto'
import { PatchPasswordDTO } from '@/users/dtos/patch-password.dto'
import { GetMeResponseDTO } from '@/users/dtos/get-me.dto'
import { UsersRepository } from '@/users/users.repository'
import { Updateable } from 'kysely'
import { User } from '@/database/types'
import { UserException } from '@/users/users.exception'
import { ResultCode } from '@/shared/errors/dtos/resultCode.dto'
import { CheckNicknameDTO } from './dtos/check-nickname.dto'
import { Api } from '@/shared/dtos/api.dto'
import { ApiException } from '@/shared/exceptions/exception.interface'

@Injectable()
export class UsersService {
  constructor(
    private readonly redisService: RedisService,
    private readonly usersRepository: UsersRepository,
  ) {}

  async getMe(id: string) {
    const foundUser = await this.getUserById(id)
    return new GetMeResponseDTO(foundUser)
  }

  async checkNicknameDuplicated(CheckNicknameDTO: CheckNicknameDTO) {
    const hasNickname = await this.usersRepository.findOneByNickname(
      CheckNicknameDTO.nickname,
    )
    if (hasNickname?.nickname) {
      throw ApiException.CONFLICT
    }

    return Api.OK(true)
  }

  async update(id: string, updateUserDTO: Updateable<User>) {
    return this.usersRepository.update(id, updateUserDTO)
  }

  async getUserById(id: string) {
    const foundUser = await this.usersRepository.findOne(id)

    if (!foundUser) throw new UserException(new ResultCode(400, 1002, ''))

    return foundUser
  }

  async changePassword(patchPasswordDTO: PatchPasswordDTO) {
    const { id, key } = await this.redisService.getChangePasswordCode(
      patchPasswordDTO.code,
    )
    if (!id) throw new NotFoundException()
    await this.usersRepository.update(id, {
      password: await this.hashPassword(patchPasswordDTO.password),
    })

    await this.redisService.removeByKey(key)

    return true
  }

  async getUserByVid(getUserByVidDTO: GetUserByVidDTO) {
    const foundUser = await this.usersRepository.findByVid(
      getUserByVidDTO.type,
      getUserByVidDTO.vid,
    )

    if (!foundUser) {
      throw new NotFoundException()
    }

    return foundUser
  }

  async hashPassword(newPassword: string) {
    return bcrypt.hash(newPassword, 10)
  }
}
