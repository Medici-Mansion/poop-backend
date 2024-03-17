import { Test } from '@nestjs/testing'
import { UsersService } from './users.service'
import { RedisService } from '@/redis/redis.service'
import { DataSource } from 'typeorm'
import { ConfigService } from '@nestjs/config'
import { NotFoundException } from '@nestjs/common'
import { CreateUserDTO, CreateUserResponseDTO } from './dtos/create-user.dto'
import { Gender } from '@/shared/constants/common.constant'

const mockRedisService = () => ({
  findById: jest.fn(),
  setPasswordCode: jest.fn(),
  setChangePasswordCode: jest.fn(),
  getChangePasswordCode: jest.fn(),
  removeByKey: jest.fn(),
})

const mockRepository = {
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  findOneOrFail: jest.fn(),
  delete: jest.fn(),
}

const manager = {
  getRepository: () => mockRepository,
}

const dataSource = {
  createEntityManager: jest.fn(),
  manager,
}

const id = '1234'
const user = { id, nickname: 'NIKCNAME' }

describe('UserService', () => {
  let service: UsersService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: RedisService,
          useValue: mockRedisService,
        },
        {
          provide: ConfigService,
          useValue: ConfigService,
        },
        {
          provide: DataSource,
          useValue: dataSource,
        },
      ],
    }).compile()
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
      dataSource.manager
        .getRepository()
        .findOne.mockRejectedValue(new NotFoundException('ok'))
      await expect(async () => {
        await service.getUserById(id)
      }).rejects.toThrow(new NotFoundException('ok'))
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
    it('새로운 사용자를 생성할 수 있다.', async () => {
      const repository = dataSource.manager.getRepository()
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
  })
})
