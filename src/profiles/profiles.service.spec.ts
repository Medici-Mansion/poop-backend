import { $Enums, PrismaClient } from '@prisma/client'
import { Test } from '@nestjs/testing'
import { MemoryStoredFile } from 'nestjs-form-data'
import { NotFoundException } from '@nestjs/common'

import {
  mockBaseService,
  mockBreedsService,
  mockDataSourceService,
  mockExternalsService,
  mockUsersService,
} from '@test/mocks/service'

import { Gender } from '@/shared/constants/common.constant'

import { CreateProfileDTO } from '@/profiles/dtos/create-profile.dto'

import { BreedsService } from '@/breeds/breeds.service'
import { ProfilesService } from '@/profiles/profiles.service'
import { BaseService } from '@/shared/services/base.service'
import { ExternalsService } from '@/externals/externals.service'
import { UsersService } from '@/users/users.service'
import { DataSourceService } from '@/prisma/datasource.service'
import { AppModule } from '@/app.module'

describe('AuthService', () => {
  const userId = '1'
  let service: ProfilesService

  afterEach(() => {
    jest.clearAllMocks()
  })
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        {
          provide: BaseService,
          useValue: mockBaseService,
        },
        {
          provide: ExternalsService,
          useValue: mockExternalsService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: BreedsService,
          useValue: mockBreedsService,
        },
        {
          provide: DataSourceService,
          useValue: mockDataSourceService,
        },
        ProfilesService,
      ],
    }).compile()
    await module.init()
    service = module.get<ProfilesService>(ProfilesService)
    console.log(module.get(PrismaClient))
  })

  it('should be defined.', () => {
    expect(service).toBeDefined()
  })

  describe('createProfile', () => {
    mockDataSourceService.manager.profile.create.mockResolvedValue({
      avatarUrl: '',
      breedId: '',
      deletedAt: null,
      gender: $Enums.Gender.NONE,
      id: '1',
      name: '??',
      userId: '??',
      birthday: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    it('새로운 프로필이 생성된다.', async () => {
      const uploadFileResult = [{ url: 'https://avatar.com' }]
      mockExternalsService.uploadFiles.mockResolvedValue(uploadFileResult)
      const createProfileDTO: CreateProfileDTO = {
        avatar: new MemoryStoredFile(),
        birthday: '2020-01-01',
        breedId: 'breed',
        gender: Gender.MALE,
        name: 'test',
      }
      const result = await service.createProfile(userId, createProfileDTO)

      expect(result).toBe(true)
      expect(mockExternalsService.uploadFiles).toHaveBeenCalledWith([
        createProfileDTO.avatar,
      ])

      expect(
        mockDataSourceService.manager.profile.create,
      ).toHaveBeenCalledTimes(1)
      expect(mockExternalsService.uploadFiles).toHaveBeenCalledTimes(1)
    })

    it('존재하지 않는 회원일 경우, NotFoundException을 던진다.', async () => {
      mockUsersService.getUserById.mockRejectedValue(new NotFoundException())
      const createProfileDTO: CreateProfileDTO = {
        avatar: new MemoryStoredFile(),
        birthday: '2020-01-01',
        breedId: 'breed',
        gender: Gender.MALE,
        name: 'test',
      }
      expect(async () => {
        await service.createProfile(userId, createProfileDTO)
      }).rejects.toThrow(new NotFoundException())

      expect(mockUsersService.getUserById).toHaveBeenCalledWith(userId)
      expect(mockUsersService.getUserById).toHaveBeenCalledTimes(1)
    })
  })

  // describe('getMyProfileList', () => {
  //   it('내가 보유한 프로필 목록을 조회한다.', async () => {
  //     const profiles = Array.from({ length: 5 }).map(() =>
  //       Profiles.of({
  //         userId,
  //         avatarUrl: '',
  //         birthday: '',
  //         breedId: '',
  //         gender: Gender.FEMALE,
  //         name: '',
  //       }),
  //     )
  //     mockBaseService.getManager().find.mockResolvedValue(profiles)
  //     const result = await service.getMyProfileList(userId)

  //     expect(result).toEqual(
  //       profiles.map((profile) => new GetProfileDTO(profile)),
  //     )
  //     expect(mockBaseService.getManager().find).toHaveBeenCalledWith(Profiles, {
  //       where: { userId },
  //       relations: { user: true },
  //     })

  //     expect(mockBaseService.getManager().find).toHaveBeenCalledTimes(1)
  //   })
  // })

  // describe('loginProfile', () => {
  //   const loginProfileDTO: LoginProfileDTO = {
  //     profileId: '1',
  //   }

  //   it('프로필 로그인에 성공한다.', async () => {
  //     mockUsersService.getUserById.mockResolvedValue({ id: userId })

  //     const result = await service.loginProfile(userId, loginProfileDTO)

  //     expect(result).toBe(true)

  //     expect(mockBaseService.getManager().update).toHaveBeenCalledWith(
  //       Users,
  //       userId,
  //       { latestProfileId: loginProfileDTO.profileId },
  //     )
  //     expect(mockUsersService.getUserById).toHaveBeenCalledWith(userId)

  //     expect(mockUsersService.getUserById).toHaveBeenCalledTimes(1)
  //     expect(mockBaseService.getManager().update).toHaveBeenCalledTimes(1)
  //   })
  // })
})
