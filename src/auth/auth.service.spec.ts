import { JwtService } from '@nestjs/jwt'
import { AuthService } from '@/auth/auth.service'
import { RedisService } from '@/redis/redis.service'
import { BaseService } from '@/shared/services/base.service'
import { Test } from '@nestjs/testing'
import {
  mockBaseService,
  mockExternalsService,
  mockRedisService,
  mockUsersService,
  mockVerificationsService,
} from '@test/mocks/service'
import { manager, mockJwtService } from '@test/mocks/base'
import { UsersService } from '@/users/users.service'
import { VerificationsService } from '@/verifications/verifications.service'
import { ExternalsService } from '@/externals/externals.service'
import { CreateUserDTO } from '@/users/dtos/create-user.dto'
import { Gender } from '@/shared/constants/common.constant'
import { GetUserByVidDTO } from '@/users/dtos/get-user-by-vid.dto'
import {
  VerificationType,
  VerifyCodeDTO,
} from '@/verifications/dtos/verify-code.dto'

describe('AuthService', () => {
  let service: AuthService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: BaseService,
          useValue: mockBaseService,
        },
        {
          provide: RedisService,
          useValue: mockRedisService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: VerificationsService,
          useValue: mockVerificationsService,
        },
        {
          provide: ExternalsService,
          useValue: mockExternalsService,
        },
        AuthService,
      ],
    })

      .compile()
    service = module.get<AuthService>(AuthService)
  })

  it('should be defined.', () => {
    expect(service).toBeDefined()
  })

  describe('signup', () => {
    const createUserDTO: CreateUserDTO = {
      birthday: '2024-01-01',
      email: 'aaa@aaa.com',
      gender: Gender.FEMALE,
      id: '1',
      nickname: '1',
      password: '1',
      phone: '01000000000',
    }

    it('회원정보를 통해 회원가입에 성공한다.', async () => {
      const createUserResponse = { id: '1' }
      mockUsersService.createUser.mockResolvedValue(createUserResponse)
      const result = await service.signup(createUserDTO)

      expect(result).toBe(true)
    })
  })

  describe('requestVerificationCode', () => {
    it('이메일 통해 인증코드를 전송받는다.', async () => {
      const getUserByVidDTO: GetUserByVidDTO = {
        type: VerificationType.EMAIL,
        vid: '222@gg.com',
      }
      const foundVerification = {
        id: '1',
        save: jest.fn(),
      }

      mockVerificationsService.getUserByVid.mockResolvedValue(foundVerification)
      const result = await service.requestVerificationCode(getUserByVidDTO)

      expect(result).toBe(true)
      expect(foundVerification.save).toHaveBeenCalledTimes(1)
      expect(mockExternalsService.sendEmail).toHaveBeenCalledTimes(1)
      expect(mockExternalsService.sendSMS).toHaveBeenCalledTimes(0)

      mockExternalsService.sendEmail.mockClear()
      mockExternalsService.sendSMS.mockClear()
    })
    it('전화번호를 통해 인증코드를 전송받는다.', async () => {
      const getUserByVidDTO: GetUserByVidDTO = {
        type: VerificationType.PHONE,
        vid: '01093339999',
      }
      const foundVerification = {
        id: '1',
        save: jest.fn(),
      }
      mockVerificationsService.getUserByVid.mockResolvedValue(foundVerification)
      const result = await service.requestVerificationCode(getUserByVidDTO)

      expect(result).toBe(true)
      expect(foundVerification.save).toHaveBeenCalledTimes(1)
      expect(mockExternalsService.sendEmail).toHaveBeenCalledTimes(0)
      expect(mockExternalsService.sendSMS).toHaveBeenCalledTimes(1)

      mockExternalsService.sendEmail.mockClear()
      mockExternalsService.sendSMS.mockClear()
    })
  })

  /**
   * @dependency verificationsService.verifyingCode
   */
  describe('verifyingCode', () => {
    const verifyCodeDTO: VerifyCodeDTO = {
      code: '1234',
      type: VerificationType.EMAIL,
      vid: '123@ggg.ggg',
    }

    it('이메일을 통해 인증을 성공한다', async () => {
      const foundVerification = {
        id: '1',
        user: { id: '1' },
      }
      mockVerificationsService.verifyingCode.mockResolvedValue(
        foundVerification,
      )
      const result = await service.verifyingCode(verifyCodeDTO)

      expect(result).toBe(true)
      expect(mockVerificationsService.verifyingCode).toHaveBeenCalledTimes(1)
      expect(mockVerificationsService.verifyingCode).toHaveBeenCalledWith(
        verifyCodeDTO,
      )

      expect(manager.getRepository().update).toHaveBeenCalledTimes(1)
      expect(manager.getRepository().update).toHaveBeenCalledWith(
        foundVerification.user.id,
        {
          verified: expect.any(Function),
        },
      )

      expect(mockVerificationsService.removeVerification).toHaveBeenCalledTimes(
        1,
      )
      expect(mockVerificationsService.removeVerification).toHaveBeenCalledWith(
        foundVerification.id,
      )
    })
    it.todo('전화번호를 통해 인증을 성공한다')
  })
})
