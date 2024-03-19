import { Test } from '@nestjs/testing'
import { UsersService } from './users.service'
import { RedisService } from '@/redis/redis.service'
import { ConfigService } from '@nestjs/config'
import { ConflictException, NotFoundException } from '@nestjs/common'
import { CreateUserDTO, CreateUserResponseDTO } from './dtos/create-user.dto'
import { Gender } from '@/shared/constants/common.constant'
import { PatchPasswordDTO } from './dtos/patch-password.dto'
import { VerificationType } from '@/verifications/dtos/verify-code.dto'
import { BaseService } from '@/shared/services/base.service'
import { Users } from '@/users/models/users.model'
import { GetUserByVidDTO } from './dtos/get-user-by-vid.dto'

const mockRedisService = {
  findById: jest.fn(),
  setPasswordCode: jest.fn(),
  setChangePasswordCode: jest.fn(),
  getChangePasswordCode: jest.fn(),
  removeByKey: jest.fn(),
}

const mockRepository = {
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  findOneOrFail: jest.fn(),
  delete: jest.fn(),
}

const manager = {
  getRepository: () => mockRepository,
  update: jest.fn(),
}

const dataSource = {
  createEntityManager: jest.fn(),
  manager,
}

const mockBaseService = {
  getManager() {
    return dataSource.manager
  },
  configService: ConfigService,
}
const id = '1234'
const user = { id, nickname: 'NIKCNAME' }

describe('UserService', () => {
  let service: UsersService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: BaseService,
          useValue: mockBaseService,
        },
        {
          provide: RedisService,
          useValue: mockRedisService,
        },
        UsersService,
      ],
    })

      .compile()
    service = module.get<UsersService>(UsersService)
  })

  afterEach(() => jest.clearAllMocks())

  it('should be defined.', () => {
    expect(service).toBeDefined()
  })

  describe('getUserById', () => {
    it('사용자 정보를 조회할 수 있다.', async () => {
      jest.spyOn(service, 'getUserById')
      dataSource.manager.getRepository().findOne = jest
        .fn()
        .mockResolvedValue(user)
      const result = await service.getUserById(id)

      expect(result).toBe(user)
      expect(service.getUserById).toHaveBeenCalledWith(expect.any(String))
      expect(service.getUserById).toHaveBeenCalledTimes(1)
    })
    it('사용자 정보 조회에 실패한다.', async () => {
      dataSource.manager.getRepository().findOne.mockResolvedValue(null)
      await expect(async () => {
        await service.getUserById(id)
      }).rejects.toThrow(new NotFoundException())
    })
  })

  describe('getUserByAccountId', () => {
    it('사용자 정보를 조회할 수 있다.', async () => {
      jest.spyOn(service, 'getUserByAccountId')
      dataSource.manager.getRepository().findOne = jest
        .fn()
        .mockResolvedValue(user)
      const result = await service.getUserByAccountId(id)

      expect(result).toBe(user)
      expect(service.getUserByAccountId).toHaveBeenCalledWith(
        expect.any(String),
      )
      expect(service.getUserByAccountId).toHaveBeenCalledTimes(1)
    })
    it('사용자 정보 조회에 실패한다.', async () => {
      dataSource.manager
        .getRepository()
        .findOne.mockRejectedValue(new NotFoundException('ok'))
      await expect(async () => {
        await service.getUserByAccountId(id)
      }).rejects.toThrow(new NotFoundException('ok'))
    })
  })

  describe('createUser', () => {
    const createUserDTO: CreateUserDTO = {
      birthday: '2024-01-01',
      email: 'aaa@aaa.com',
      gender: Gender.MALE,
      id: '1123213',
      nickname: 'test',
      password: '1234',
      phone: '01012345678',
    }

    const createUserDTOResponse: CreateUserResponseDTO = {
      accountId: '1234',
      birthday: createUserDTO.birthday,
      id: createUserDTO.id,
    }
    const repository = dataSource.manager.getRepository()
    it('새로운 사용자를 생성할 수 있다.', async () => {
      repository.findOne.mockResolvedValue(null)
      repository.save.mockResolvedValue(createUserDTOResponse)
      repository.create.mockReturnValue({
        accountId: createUserDTO.id,
        ...createUserDTO,
      })
      const result = await service.createUser(createUserDTO)

      expect(result).toEqual(createUserDTOResponse)
      expect(repository.findOne).toHaveBeenCalledWith({
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
      expect(repository.save).toHaveBeenCalledTimes(1)
      expect(repository.save).toHaveBeenCalledWith({
        accountId: createUserDTO.id,
        ...createUserDTO,
      })
    })

    it('이미 존재하는 회원일 경우 ConflictException을 던진다', async () => {
      repository.findOne.mockResolvedValue(user)

      await expect(async () => {
        await service.createUser(createUserDTO)
      }).rejects.toThrow(new ConflictException())
    })
  })

  describe('changePassword', () => {
    const patchPasswordDTO: PatchPasswordDTO = {
      code: '123',
      password: '123',
      type: VerificationType.EMAIL,
      vid: 'test',
    }

    it('패스워드를 변경 할 수 있다.', async () => {
      const passwordCodeReturnValue = {
        id: '1',
        key: `PASSWORD_CHANGE:123`,
      }
      mockRedisService.getChangePasswordCode.mockResolvedValue(
        passwordCodeReturnValue,
      )
      const spy = jest.spyOn(service, 'changePassword')

      const result = await service.changePassword(patchPasswordDTO)

      expect(result).toBe(true)

      expect(spy).toHaveBeenCalledWith(patchPasswordDTO)
      expect(spy).toHaveBeenCalledTimes(1)

      expect(mockRedisService.getChangePasswordCode).toHaveBeenCalledWith(
        patchPasswordDTO.code,
      )
      expect(mockRedisService.getChangePasswordCode).toHaveBeenCalledTimes(1)

      expect(mockBaseService.getManager().update).toHaveBeenCalledTimes(1)
      expect(mockBaseService.getManager().update).toHaveBeenCalledWith(
        Users,
        passwordCodeReturnValue.id,
        expect.any(Object),
      )
    })

    it('인증키가 없을 경우, NotFoundException을 던진다.', async () => {
      const passwordCodeReturnValue = {
        id: null,
        key: '123',
      }
      mockRedisService.getChangePasswordCode.mockResolvedValue(
        passwordCodeReturnValue,
      )
      const spy = jest.spyOn(service, 'changePassword')

      await expect(async () => {
        await service.changePassword(patchPasswordDTO)
      }).rejects.toThrow(new NotFoundException())

      expect(spy).toHaveBeenCalledWith(patchPasswordDTO)
      expect(spy).toHaveBeenCalledTimes(1)

      expect(mockRedisService.getChangePasswordCode).toHaveBeenCalledWith(
        patchPasswordDTO.code,
      )
      expect(mockRedisService.getChangePasswordCode).toHaveBeenCalledTimes(1)
    })
  })

  describe('getUserByVid', () => {
    const getUserByVidDTO: GetUserByVidDTO = {
      type: VerificationType.EMAIL,
      vid: '123',
    }
    const cond = {
      [getUserByVidDTO.type.toLowerCase()]: getUserByVidDTO.vid,
    }
    it('vid로 사용자 조회를 할 수 있다.', async () => {
      const foundUser = { id: '1', ...cond }
      manager.getRepository().findOne.mockResolvedValue(foundUser)
      const spy = jest.spyOn(service, 'getUserByVid')

      const result = await service.getUserByVid(getUserByVidDTO)

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(getUserByVidDTO)

      expect(manager.getRepository().findOne).toHaveBeenCalledTimes(1)
      expect(manager.getRepository().findOne).toHaveBeenCalledWith({
        where: cond,
      })

      expect(result).toEqual(foundUser)
    })
    it('vid에 맞는 사용자가 없을 경우 NotFoundException을 던진다.', async () => {
      manager.getRepository().findOne.mockResolvedValue(null)
      const spy = jest.spyOn(service, 'getUserByVid')
      await expect(async () => {
        await service.getUserByVid(getUserByVidDTO)
      }).rejects.toThrow(new NotFoundException())

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(getUserByVidDTO)

      expect(manager.getRepository().findOne).toHaveBeenCalledTimes(1)
      expect(manager.getRepository().findOne).toHaveBeenCalledWith({
        where: cond,
      })
    })
  })

  describe('getUserByAccountId', () => {
    const accountId = '123'

    it('accountId로 사용자 조회를 할 수 있다.', async () => {
      const foundUser = { id: '1', accountId }
      manager.getRepository().findOne.mockResolvedValue(foundUser)
      const spy = jest.spyOn(service, 'getUserByAccountId')

      const result = await service.getUserByAccountId(accountId)

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(accountId)

      expect(manager.getRepository().findOne).toHaveBeenCalledTimes(1)
      expect(manager.getRepository().findOne).toHaveBeenCalledWith({
        where: { accountId },
      })

      expect(result).toEqual(foundUser)
    })
    it('accountId에 맞는 사용자가 없을 경우 NotFoundException을 던진다.', async () => {
      manager.getRepository().findOne.mockResolvedValue(null)
      const spy = jest.spyOn(service, 'getUserByAccountId')

      await expect(async () => {
        await service.getUserByAccountId(accountId)
      }).rejects.toThrow(new NotFoundException())

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(accountId)

      expect(manager.getRepository().findOne).toHaveBeenCalledTimes(1)
      expect(manager.getRepository().findOne).toHaveBeenCalledWith({
        where: { accountId },
      })
    })
  })
})
