import { Injectable, NotFoundException } from '@nestjs/common'
import bcrypt from 'bcrypt'
import { Prisma, User } from '@prisma/client'

import { RedisService } from '@/redis/redis.service'
import { DataSourceService } from '@/prisma/datasource.service'

import { GetUserByVidDTO } from '@/users/dtos/get-user-by-vid.dto'
import { PatchPasswordDTO } from '@/users/dtos/patch-password.dto'
import { GetMeResponseDTO } from '@/users/dtos/get-me.dto'

@Injectable()
export class UsersService {
  constructor(
    private readonly redisService: RedisService,
    private readonly dataSourceService: DataSourceService,
  ) {}

  async getMe(id: string) {
    const foundUser = await this.getUserById(id)
    return new GetMeResponseDTO(foundUser)
  }

  async getUserById(id: string) {
    const foundUser = await this.dataSourceService.manager.user.findUnique({
      where: {
        id,
      },
      include: {
        latestProfile: true,
      },
    })

    if (!foundUser) throw new NotFoundException()

    return foundUser
  }

  async getUserByAccountId(accountId: string) {
    const foundUser = await this.dataSourceService.manager.user.findFirst({
      where: {
        accountId,
      },
    })

    if (!foundUser) throw new NotFoundException()

    return foundUser
  }

  async changePassword(patchPasswordDTO: PatchPasswordDTO) {
    const { id, key } = await this.redisService.getChangePasswordCode(
      patchPasswordDTO.code,
    )
    if (!id) throw new NotFoundException()
    await this.dataSourceService.manager.user.update({
      where: { id },
      data: {
        password: await this.hashPassword(patchPasswordDTO.password),
      },
    })

    await this.redisService.removeByKey(key)

    return true
  }

  // TODO 사용자 응답 DTO 리턴하기
  async getUserByVid(getUserByVidDTO: GetUserByVidDTO): Promise<User> {
    const userWhereCond: Prisma.UserWhereInput = {
      [getUserByVidDTO.type.toLowerCase()]: getUserByVidDTO.vid,
    }

    const foundUser = await this.dataSourceService.manager.user.findFirst({
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
