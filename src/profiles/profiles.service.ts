import { UsersService } from '../users/users.service'
import { Injectable } from '@nestjs/common'

import { Profiles } from '@/profiles/models/profiles.model'

import { ExternalsService } from '@/externals/externals.service'
import { BaseService } from '@/shared/services/base.service'

import { CreateProfileDTO } from '@/profiles/dtos/create-profile.dto'
import { GetProfileDTO } from './dtos/get-profile.dto'
import { LoginProfileDTO } from './dtos/login-profile.dto'
import { Users } from '@/users/models/users.model'

@Injectable()
export class ProfilesService {
  constructor(
    private readonly baseService: BaseService,
    private readonly externalsService: ExternalsService,
    private readonly usersService: UsersService,
  ) {}

  async createProfile(userId: string, createProfileDTO: CreateProfileDTO) {
    // 존재하는 회원여부 확인
    await this.usersService.getUserById(userId)
    const avatarUrl = await this.externalsService.uploadFiles([
      createProfileDTO.avatar,
    ])

    const repository = this.baseService.getManager().getRepository(Profiles)
    await repository.save(
      repository.create({
        ...createProfileDTO,
        avatarUrl: avatarUrl[0].url,
        userId,
      }),
    )
    return true
  }

  async getMyProfileList(userId: string) {
    const profiles = await this.baseService.getManager().find(Profiles, {
      where: {
        userId,
      },
      relations: {
        user: true,
      },
    })
    return profiles.map((profile) => new GetProfileDTO(profile))
  }

  async loginProfile(userId: string, loginProfileDTO: LoginProfileDTO) {
    const user = await this.usersService.getUserById(userId)
    await this.baseService.getManager().update(Users, user.id, {
      latestProfileId: loginProfileDTO.profileId,
    })

    return true
  }
}
