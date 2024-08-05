import { EsService } from './../externals/modules/es/es.service'
import { Injectable } from '@nestjs/common'
import { Transactional } from '@nestjs-cls/transactional'

import { UsersService } from '@/users/users.service'
import { ExternalsService } from '@/externals/externals.service'
import { BreedsService } from '@/breeds/breeds.service'

import { CreateProfileDTO } from '@/profiles/dtos/create-profile.dto'
import { GetProfileDTO } from '@/profiles/dtos/get-profile.dto'
import { LoginProfileDTO } from '@/profiles/dtos/login-profile.dto'
import { ProfilesRepository } from '@/profiles/profiles.repository'
import dayjs from 'dayjs'

@Injectable()
export class ProfilesService {
  constructor(
    private readonly externalsService: ExternalsService,
    private readonly usersService: UsersService,
    private readonly breedsService: BreedsService,
    private readonly profilesRepository: ProfilesRepository,
    private readonly esService: EsService,
  ) {}

  @Transactional()
  async createProfile(userId: string, createProfileDTO: CreateProfileDTO) {
    // 존재하는 회원여부 확인
    await this.usersService.getUserById(userId)
    const avatarUrl = await this.externalsService.uploadFiles({
      files: [createProfileDTO.avatar],
      folder: 'profile',
    })

    // 존재하는 견종 확인
    const foundBreeds = await this.breedsService.findById(
      createProfileDTO.breedId,
    )

    const newProfile = await this.profilesRepository.create({
      name: createProfileDTO.name,
      gender: createProfileDTO.gender,
      avatarUrl: avatarUrl[0],
      birthday: new Date(createProfileDTO.birthday),
      breedId: foundBreeds.id,
      userId,
      updatedAt: new Date(),
    })
    if (newProfile) {
      await this.esService.createIndex({
        target: 'poop-profiles',
        targetData: {
          ...newProfile,
          createdAt: dayjs(newProfile.createdAt).format(),
          updatedAt: dayjs(newProfile.updatedAt).format(),
          avatarUrl: newProfile.avatarUrl || '',
          birthday: dayjs(newProfile.birthday).format(),
        },
      })
    }

    return true
  }

  async getMyProfileList(userId: string) {
    const profiles = await this.profilesRepository.findByUserId(userId)
    return profiles.map((profile) => {
      profile.gender
      return new GetProfileDTO(profile)
    })
  }

  async loginProfile(userId: string, loginProfileDTO: LoginProfileDTO) {
    const user = await this.usersService.getUserById(userId)
    await this.usersService.update(user.id, {
      latestProfileId: loginProfileDTO.profileId,
    })

    return true
  }
}
