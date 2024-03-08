import { UsersService } from './../users/users.service'
import { Injectable } from '@nestjs/common'

import { Profiles } from '@/profiles/models/profiles.model'

import { ExternalsService } from '@/externals/externals.service'
import { BaseService } from '@/shared/services/base.service'

import { CreateProfileDTO } from '@/profiles/dtos/create-profile.dto'

@Injectable()
export class ProfilesService extends BaseService {
  constructor(
    private readonly externalsService: ExternalsService,
    private readonly usersService: UsersService,
  ) {
    super()
  }

  async createProfile(userId: string, createProfileDTO: CreateProfileDTO) {
    // 존재하는 회원여부 확인
    await this.usersService.getUserById(userId)
    const avatarUrl = await this.externalsService.uploadFiles([
      createProfileDTO.avatar,
    ])

    const repository = this.getManager().getRepository(Profiles)
    await repository.save(
      repository.create({
        ...createProfileDTO,
        avatarUrl: avatarUrl[0].url,
        userId,
      }),
    )
    return true
  }
}
