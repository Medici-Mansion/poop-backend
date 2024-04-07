import { Injectable } from '@nestjs/common'

import { UsersService } from '@/users/users.service'
import { ExternalsService } from '@/externals/externals.service'
import { BreedsService } from '@/breeds/breeds.service'

import { CreateProfileDTO } from '@/profiles/dtos/create-profile.dto'
import { GetProfileDTO } from '@/profiles/dtos/get-profile.dto'
import { LoginProfileDTO } from '@/profiles/dtos/login-profile.dto'
import { PrismaService } from '@/prisma/prisma.service'

@Injectable()
export class ProfilesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly externalsService: ExternalsService,
    private readonly usersService: UsersService,
    private readonly breedsService: BreedsService,
  ) {}

  async createProfile(userId: string, createProfileDTO: CreateProfileDTO) {
    // 존재하는 회원여부 확인
    await this.usersService.getUserById(userId)
    const avatarUrl = await this.externalsService.uploadFiles([
      createProfileDTO.avatar,
    ])

    // 존재하는 견종 확인
    const foundBreeds = await this.breedsService.findById(
      createProfileDTO.breedId,
    )
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { breedId: _, ...rest } = createProfileDTO
    await this.prismaService.profile.create({
      data: {
        ...rest,
        avatarUrl: avatarUrl[0].url,
        birthday: new Date(createProfileDTO.birthday),
        user: {
          connect: {
            id: userId,
          },
        },
        breed: {
          connect: {
            id: foundBreeds.id,
          },
        },
      },
    })
    return true
  }

  async getMyProfileList(userId: string) {
    const profiles = await this.prismaService.profile.findMany({
      where: {
        userId,
      },
      include: {
        user: true,
      },
    })
    return profiles.map((profile) => {
      profile.gender
      return new GetProfileDTO(profile)
    })
  }

  async loginProfile(userId: string, loginProfileDTO: LoginProfileDTO) {
    const user = await this.usersService.getUserById(userId)
    await this.prismaService.user.update({
      where: { id: user.id },
      data: {
        latestProfileId: loginProfileDTO.profileId,
      },
    })

    return true
  }
}
