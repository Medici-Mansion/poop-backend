import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import {
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'

import { UsersService } from '@/users/users.service'
import { VerificationsService } from '@/verifications/verifications.service'
import { ExternalsService } from '@/externals/externals.service'
import { LoginRequestDTO, LoginType } from '@/auth/dtos/login.dto'
import { AuthService } from '@/auth/auth.service'
import { RedisService } from '@/redis/redis.service'
import { BaseService } from '@/shared/services/base.service'
import {
  mockBaseService,
  mockExternalsService,
  mockRedisService,
  mockUsersService,
  mockVerificationsService,
} from '@test/mocks/service'

import { Gender } from '@/shared/constants/common.constant'

import { CreateUserDTO } from '@/users/dtos/create-user.dto'
import { GetUserByVidDTO } from '@/users/dtos/get-user-by-vid.dto'
import {
  VerificationType,
  VerifyCodeDTO,
} from '@/verifications/dtos/verify-code.dto'

import { manager, mockJwtService } from '@test/mocks/base'
import { RefreshDTO } from './dtos/refresh.dto'
import { TokenType } from '@/shared/interfaces/token.interface'
import { randomUUID } from 'crypto'

describe('AuthService', () => {
  let service: AuthService

  const publishTokenValue = {
    accessToken: 'mockToken',
    refreshToken: 'mockToken',
  }

  afterEach(() => {
    jest.clearAllMocks()
  })
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

      mockVerificationsService.getVerificationByVid.mockResolvedValue(
        foundVerification,
      )
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
      mockVerificationsService.getVerificationByVid.mockResolvedValue(
        foundVerification,
      )
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

    it('인증을 성공한다', async () => {
      const foundVerification = {
        id: '1',
        user: { id: '1' },
      }
      mockVerificationsService.verifyingCode.mockResolvedValue(true)
      mockVerificationsService.getVerificationByVid.mockResolvedValue(
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
  })

  describe('login', () => {
    const loginRequestDTO: LoginRequestDTO = {
      id: '123@fff.ff',
      loginType: LoginType.EMAIL,
      password: '123',
    }

    it('로그인에 성공한다', async () => {
      const foundUser = {
        id: randomUUID(),
        verified: true,
        password: '123',
        checkPassword: jest.fn(),
      }

      manager.getRepository().findOne.mockResolvedValue(foundUser)
      foundUser.checkPassword.mockReturnValue(true)
      jest
        .spyOn(service, 'sign')
        .mockResolvedValue(publishTokenValue.accessToken)

      const cond = { [loginRequestDTO.loginType]: loginRequestDTO.id }
      const result = await service.login(loginRequestDTO)

      expect(result).toEqual(publishTokenValue)

      expect(manager.getRepository().findOne).toHaveBeenCalledWith({
        where: cond,
      })
      expect(manager.getRepository().findOne).toHaveBeenCalledTimes(1)

      expect(foundUser.checkPassword).toHaveBeenCalledWith(
        loginRequestDTO.password,
      )
      expect(foundUser.checkPassword).toHaveBeenCalledTimes(1)
    })

    it('존재하지 않는 정보일 경우 NotFoundException을 던진다', async () => {
      manager.getRepository().findOne.mockResolvedValue(null)

      const cond = { [loginRequestDTO.loginType]: loginRequestDTO.id }
      await expect(async () => {
        await service.login(loginRequestDTO)
      }).rejects.toThrow(new NotFoundException())

      expect(manager.getRepository().findOne).toHaveBeenCalledWith({
        where: cond,
      })
      expect(manager.getRepository().findOne).toHaveBeenCalledTimes(1)
    })

    it('인증되지 않는 계정일 경우, ForbiddenException을 던진다', async () => {
      const foundUser = {
        id: '1',
        verified: false,
        password: '123',
      }
      manager.getRepository().findOne.mockResolvedValue(foundUser)

      const cond = { [loginRequestDTO.loginType]: loginRequestDTO.id }
      await expect(async () => {
        await service.login(loginRequestDTO)
      }).rejects.toThrow(new ForbiddenException())

      expect(manager.getRepository().findOne).toHaveBeenCalledWith({
        where: cond,
      })
      expect(manager.getRepository().findOne).toHaveBeenCalledTimes(1)
    })
  })

  describe('getChangePasswordCode', () => {
    it('이메일을 통해 비밀번호 변경용 인증코드를 받는다.', async () => {
      const getUserByVidDTO: GetUserByVidDTO = {
        type: VerificationType.EMAIL,
        vid: 'www@www.ww',
      }
      const foundUser = {
        id: '1',
        password: '123',
      }

      const code = '1234'

      mockUsersService.getUserByVid.mockResolvedValue(foundUser)
      mockVerificationsService.generateRandomString.mockReturnValue(code)

      const result = await service.getChangePasswordCode(getUserByVidDTO)

      expect(result).toBe(true)

      expect(mockUsersService.getUserByVid).toHaveBeenCalledTimes(1)
      expect(mockRedisService.setPasswordCode).toHaveBeenCalledTimes(1)
      expect(mockExternalsService.sendEmail).toHaveBeenCalledTimes(1)
      expect(
        mockVerificationsService.generateRandomString,
      ).toHaveBeenCalledTimes(1)
      expect(mockExternalsService.sendSMS).toHaveBeenCalledTimes(0)

      expect(mockExternalsService.sendEmail).toHaveBeenCalledWith(
        expect.any(String),
        getUserByVidDTO.vid,
        expect.any(String),
        expect.any(Array),
      )
      expect(mockRedisService.setPasswordCode).toHaveBeenCalledWith(
        foundUser.id,
        code,
      )
    })
    it('전화번호를 통해 비밀번호 변경용 인증코드를 받는다.', async () => {
      const getUserByVidDTO: GetUserByVidDTO = {
        type: VerificationType.PHONE,
        vid: '01000000000',
      }
      const foundUser = {
        id: '1',
        password: '123',
      }

      const code = '1234'

      mockUsersService.getUserByVid.mockResolvedValue(foundUser)
      mockVerificationsService.generateRandomString.mockReturnValue(code)

      const result = await service.getChangePasswordCode(getUserByVidDTO)

      expect(result).toBe(true)

      expect(mockUsersService.getUserByVid).toHaveBeenCalledTimes(1)
      expect(mockRedisService.setPasswordCode).toHaveBeenCalledTimes(1)
      expect(mockExternalsService.sendEmail).toHaveBeenCalledTimes(0)
      expect(
        mockVerificationsService.generateRandomString,
      ).toHaveBeenCalledTimes(1)
      expect(mockExternalsService.sendSMS).toHaveBeenCalledTimes(1)

      expect(mockExternalsService.sendSMS).toHaveBeenCalledWith(
        expect.any(String),
        getUserByVidDTO.vid,
      )
      expect(mockRedisService.setPasswordCode).toHaveBeenCalledWith(
        foundUser.id,
        code,
      )
    })
  })
  describe('verifyChangePasswordCode', () => {
    const verifyCodeDTO: VerifyCodeDTO = {
      code: '1234',
      type: VerificationType.EMAIL,
      vid: 'www@www.www',
    }

    it('이메일을 통해 비밀번호 변경용 키를 받는다.', async () => {
      const foundUser = {
        id: '1',
        password: '123',
      }
      const randomString = '12341234'
      mockUsersService.getUserByVid.mockResolvedValue(foundUser)
      mockRedisService.findById.mockResolvedValue('1234')
      mockVerificationsService.generateRandomString.mockReturnValue(
        randomString,
      )

      const result = await service.verifyChangePasswordCode(verifyCodeDTO)

      expect(result).toBe(randomString)
      expect(mockUsersService.getUserByVid).toHaveBeenCalledTimes(1)
      expect(mockRedisService.findById).toHaveBeenCalledTimes(1)
      expect(
        mockVerificationsService.generateRandomString,
      ).toHaveBeenCalledTimes(1)

      expect(mockUsersService.getUserByVid).toHaveBeenCalledWith(verifyCodeDTO)
      expect(mockRedisService.findById).toHaveBeenCalledWith(foundUser.id)
      expect(mockRedisService.setChangePasswordCode).toHaveBeenCalledWith(
        foundUser.id,
        randomString,
      )
    })
    it('코드가 없을 경우, NotFoundException을 던진다.', async () => {
      const foundUser = {
        id: '1',
        password: '123',
      }
      mockUsersService.getUserByVid.mockResolvedValue(foundUser)
      mockRedisService.findById.mockResolvedValue(null)

      await expect(async () => {
        await service.verifyChangePasswordCode(verifyCodeDTO)
      }).rejects.toThrow(new NotFoundException())

      expect(mockUsersService.getUserByVid).toHaveBeenCalledTimes(1)
      expect(mockRedisService.findById).toHaveBeenCalledTimes(1)
      expect(
        mockVerificationsService.generateRandomString,
      ).toHaveBeenCalledTimes(0)

      expect(mockUsersService.getUserByVid).toHaveBeenCalledWith(verifyCodeDTO)
      expect(mockRedisService.findById).toHaveBeenCalledWith(foundUser.id)
    })
    it('코드가 일치하지 않을 경우, NotFoundException을 던진다.', async () => {
      const foundUser = {
        id: '1',
        password: '123',
      }
      mockUsersService.getUserByVid.mockResolvedValue(foundUser)
      mockRedisService.findById.mockResolvedValue('4567')

      await expect(async () => {
        await service.verifyChangePasswordCode(verifyCodeDTO)
      }).rejects.toThrow(new UnauthorizedException())

      expect(mockUsersService.getUserByVid).toHaveBeenCalledTimes(1)
      expect(mockRedisService.findById).toHaveBeenCalledTimes(1)
      expect(
        mockVerificationsService.generateRandomString,
      ).toHaveBeenCalledTimes(0)

      expect(mockUsersService.getUserByVid).toHaveBeenCalledWith(verifyCodeDTO)
      expect(mockRedisService.findById).toHaveBeenCalledWith(foundUser.id)
    })
  })
  describe('refresh', () => {
    const refreshDTO: RefreshDTO = {
      refreshToken: 'abc',
    }

    it('인증된 토큰일 경우, 새로운 리프레시토큰을 발급한다.', async () => {
      const verfiedToken = { uid: '123' }
      const foundUser = {
        id: '123',
        refreshToken: 'abc',
      }
      const verify = jest.spyOn(service, 'verify').mockReturnValue(verfiedToken)
      const signSpy = jest
        .spyOn(service, 'sign')
        .mockResolvedValue(publishTokenValue.accessToken)
      mockUsersService.getUserById.mockResolvedValue(foundUser)
      const result = await service.refresh(refreshDTO)

      expect(result).toEqual(publishTokenValue)

      expect(verify).toHaveBeenCalledTimes(1)
      expect(mockUsersService.getUserById).toHaveBeenCalledTimes(1)

      expect(verify).toHaveBeenCalledWith(refreshDTO.refreshToken)
      expect(mockUsersService.getUserById).toHaveBeenCalledWith(
        verfiedToken.uid,
      )

      expect(signSpy).toHaveBeenCalledTimes(2)
    })
    it('유저의 토큰이 없을 경우, UnauthorizedException을 던진다', async () => {
      const verfiedToken = { uid: '123' }
      const foundUser = {
        id: '123',
        refreshToken: null,
      }
      const verify = jest.spyOn(service, 'verify').mockReturnValue(verfiedToken)
      mockUsersService.getUserById.mockResolvedValue(foundUser)
      await expect(async () => {
        await service.refresh(refreshDTO)
      }).rejects.toThrow(new UnauthorizedException())

      expect(verify).toHaveBeenCalledTimes(1)
      expect(mockUsersService.getUserById).toHaveBeenCalledTimes(1)

      expect(verify).toHaveBeenCalledWith(refreshDTO.refreshToken)
      expect(mockUsersService.getUserById).toHaveBeenCalledWith(
        verfiedToken.uid,
      )
    })

    it('유저의 토큰이 다를 경우, UnauthorizedException을 던진다', async () => {
      const verfiedToken = { uid: '123' }
      const foundUser = {
        id: '123',
        refreshToken: '456',
      }
      const verify = jest.spyOn(service, 'verify').mockReturnValue(verfiedToken)
      mockUsersService.getUserById.mockResolvedValue(foundUser)
      await expect(async () => {
        await service.refresh(refreshDTO)
      }).rejects.toThrow(new UnauthorizedException())

      expect(verify).toHaveBeenCalledTimes(1)
      expect(mockUsersService.getUserById).toHaveBeenCalledTimes(1)

      expect(verify).toHaveBeenCalledWith(refreshDTO.refreshToken)
      expect(mockUsersService.getUserById).toHaveBeenCalledWith(
        verfiedToken.uid,
      )
    })
  })

  describe('verify', () => {
    const token = '123'
    const tokenPayload = { uid: '123' }

    it('정상토큰일 경우, TokenPayload를 받는다.', async () => {
      mockJwtService.verify.mockReturnValue(tokenPayload)
      mockBaseService.conf.get.mockReturnValue('123')
      const result = service.verify(token)

      expect(result).toEqual(tokenPayload)

      expect(mockJwtService.verify).toHaveBeenCalledTimes(1)
      expect(mockBaseService.conf.get).toHaveBeenCalledTimes(1)
    })

    it('비정상토큰일 경우, UnauthorizedException을 던진다.', async () => {
      const error = new UnauthorizedException()
      mockJwtService.verify.mockImplementation(() => {
        throw error
      })
      mockBaseService.conf.get.mockReturnValue('123')
      expect(() => {
        service.verify(token)
      }).toThrow(error)

      expect(mockJwtService.verify).toHaveBeenCalledTimes(1)
      expect(mockBaseService.conf.get).toHaveBeenCalledTimes(1)
    })
  })
  describe('sign', () => {
    const newToken = '123'
    const env = 'env'
    const uid = randomUUID()
    const tokenType: TokenType = 'ACCESS'

    it('uid를 통해 새로운 토큰에 서명한다', async () => {
      mockJwtService.sign.mockReturnValue(newToken)
      mockBaseService.conf.get.mockReturnValue(env)

      const result = await service.sign(uid, tokenType)

      expect(result).toEqual(newToken)

      expect(mockJwtService.sign).toHaveBeenCalledTimes(1)
      expect(mockBaseService.conf.get).toHaveBeenCalledTimes(2)

      expect(mockJwtService.sign).toHaveBeenCalledWith(expect.any(Object), {
        expiresIn: expect.stringMatching(env),
        secret: expect.stringMatching(env),
      })
    })

    it('올바르지 않은 uid일 경우, ForbiddenException을 던진다', async () => {
      await expect(async () => {
        await service.sign('123', tokenType)
      }).rejects.toThrow(new ForbiddenException())

      expect(mockJwtService.sign).toHaveBeenCalledTimes(0)
      expect(mockBaseService.conf.get).toHaveBeenCalledTimes(0)
    })
  })
})
