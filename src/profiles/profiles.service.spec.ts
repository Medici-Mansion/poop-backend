import { Test } from '@nestjs/testing'
import { MemoryStoredFile } from 'nestjs-form-data'
import { NotFoundException } from '@nestjs/common'

import {
  mockBaseService,
  mockBreedsService,
  mockExternalsService,
  mockUsersService,
} from '@test/mocks/service'

import { Gender } from '@/shared/constants/common.constant'

import { Users } from '@/users/models/users.model'
import { Profiles } from '@/profiles/models/profiles.model'

import { CreateProfileDTO } from '@/profiles/dtos/create-profile.dto'
import { GetProfileDTO } from '@/profiles/dtos/get-profile.dto'
import { LoginProfileDTO } from '@/profiles/dtos/login-profile.dto'

import { BreedsService } from '@/breeds/breeds.service'
import { ProfilesService } from '@/profiles/profiles.service'
import { BaseService } from '@/shared/services/base.service'
import { ExternalsService } from '@/externals/externals.service'
import { UsersService } from '@/users/users.service'

describe('AuthService', () => {
  const userId = '1'
  let service: ProfilesService

  afterEach(() => {
    jest.clearAllMocks()
  })
  beforeEach(async () => {
    const module = await Test.createTestingModule({
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

        ProfilesService,
      ],
    })

      .compile()
    service = module.get<ProfilesService>(ProfilesService)
  })

  it('should be defined.', () => {
    expect(service).toBeDefined()
  })

  describe('createProfile', () => {
    const mockRepositorySave = jest.spyOn(
      mockBaseService.getManager().getRepository(),
      'save',
    )
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
      expect(mockRepositorySave).toHaveBeenCalledWith(
        mockBaseService
          .getManager()
          .getRepository()
          .create({
            ...createProfileDTO,
            avatarUrl: uploadFileResult[0].url,
            userId,
          }),
      )

      expect(mockRepositorySave).toHaveBeenCalledTimes(1)
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

  describe('getMyProfileList', () => {
    it('내가 보유한 프로필 목록을 조회한다.', async () => {
      const profiles = Array.from({ length: 5 }).map(() =>
        Profiles.of({
          userId,
          avatarUrl: '',
          birthday: '',
          breedId: '',
          gender: Gender.FEMALE,
          name: '',
        }),
      )
      mockBaseService.getManager().find.mockResolvedValue(profiles)
      const result = await service.getMyProfileList(userId)

      expect(result).toEqual(
        profiles.map((profile) => new GetProfileDTO(profile)),
      )
      expect(mockBaseService.getManager().find).toHaveBeenCalledWith(Profiles, {
        where: { userId },
        relations: { user: true },
      })

      expect(mockBaseService.getManager().find).toHaveBeenCalledTimes(1)
    })
  })

  describe('loginProfile', () => {
    const loginProfileDTO: LoginProfileDTO = {
      profileId: '1',
    }

    it('프로필 로그인에 성공한다.', async () => {
      mockUsersService.getUserById.mockResolvedValue({ id: userId })

      const result = await service.loginProfile(userId, loginProfileDTO)

      expect(result).toBe(true)

      expect(mockBaseService.getManager().update).toHaveBeenCalledWith(
        Users,
        userId,
        { latestProfileId: loginProfileDTO.profileId },
      )
      expect(mockUsersService.getUserById).toHaveBeenCalledWith(userId)

      expect(mockUsersService.getUserById).toHaveBeenCalledTimes(1)
      expect(mockBaseService.getManager().update).toHaveBeenCalledTimes(1)
    })
  })
})
