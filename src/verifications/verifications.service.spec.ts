import { Test } from '@nestjs/testing'
import { VerificationsService } from '@/verifications/verifications.service'
import { BaseService } from '@/shared/services/base.service'
import { mockBaseService } from '@test/mocks/service'
import { Verification } from './models/verification.model'
import { GetUserByVidDTO } from '@/users/dtos/get-user-by-vid.dto'
import { VerificationType, VerifyCodeDTO } from './dtos/verify-code.dto'
import { ForbiddenException, NotFoundException } from '@nestjs/common'
import { IsNull } from 'typeorm'

describe('VerificationsService', () => {
  const userId = '1'
  let service: VerificationsService
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

        VerificationsService,
      ],
    })

      .compile()
    service = module.get<VerificationsService>(VerificationsService)
  })

  it('should be defined.', () => {
    expect(service).toBeDefined()
  })

  describe('createVerification', () => {
    const repository = mockBaseService.getManager().getRepository()

    it('새로운 인증이 생성된다.', async () => {
      const newVerification = Verification.of({ code: '1', userId })
      repository.create.mockReturnValue(newVerification)
      repository.save.mockReturnValue(newVerification)

      const result = await service.createVerification(userId)

      expect(result).toEqual(newVerification)

      expect(repository.save).toHaveBeenCalledWith(newVerification)
      expect(repository.create).toHaveBeenCalledWith({ userId })

      expect(repository.save).toHaveBeenCalledTimes(1)
      expect(repository.create).toHaveBeenCalledTimes(1)
    })
  })

  describe('getVerificationByVid', () => {
    const repository = mockBaseService.getManager().getRepository()
    const newVerification = Verification.of({ code: '1', userId })
    const getUserByVidDTO: GetUserByVidDTO = {
      type: VerificationType.EMAIL,
      vid: 'aaa@aaa.com',
    }
    it('vid를 통해 인증을 조회한다.', async () => {
      repository.findOne.mockResolvedValue(newVerification)
      const result = await service.getVerificationByVid(getUserByVidDTO)

      expect(result).toEqual(newVerification)

      expect(repository.findOne).toHaveBeenCalledTimes(1)

      expect(repository.findOne).toHaveBeenCalledWith({
        where: {
          user: {
            [getUserByVidDTO.type.toLowerCase()]: getUserByVidDTO.vid,
            verified: IsNull(),
          },
        },
        relations: {
          user: true,
        },
      })
    })
    it('인증이 존재하지 않을 경우, NotFoundException을 던진다.', async () => {
      repository.findOne.mockResolvedValue(null)
      await expect(async () => {
        await service.getVerificationByVid(getUserByVidDTO)
      }).rejects.toThrow(new NotFoundException())
    })
  })

  describe('verifyingCode', () => {
    const repository = mockBaseService.getManager().getRepository()
    const newVerification = Verification.of({ code: '111', userId })
    const verifyCodeDTO: VerifyCodeDTO = {
      code: '111',
      type: VerificationType.EMAIL,
      vid: 'aaa@aaa.com',
    }
    it('인증에 성공한다.', async () => {
      repository.findOne.mockResolvedValue(newVerification)
      const mockGetVerificationByVid = jest.spyOn(
        service,
        'getVerificationByVid',
      )
      mockGetVerificationByVid.mockResolvedValue(newVerification)
      const result = await service.verifyingCode(verifyCodeDTO)

      expect(result).toEqual(true)

      expect(mockGetVerificationByVid).toHaveBeenCalledTimes(1)

      expect(mockGetVerificationByVid).toHaveBeenCalledWith(verifyCodeDTO)
    })

    it('인증이 존재하지 않을 경우, NotFoundException을 던진다.', async () => {
      const mockGetVerificationByVid = jest.spyOn(
        service,
        'getVerificationByVid',
      )
      mockGetVerificationByVid.mockResolvedValue(null)
      await expect(async () => {
        await service.verifyingCode(verifyCodeDTO)
      }).rejects.toThrow(new NotFoundException())

      expect(mockGetVerificationByVid).toHaveBeenCalledTimes(1)

      expect(mockGetVerificationByVid).toHaveBeenCalledWith(verifyCodeDTO)
    })

    it('인증코드가 일치하지 않을 경우, ForbiddenException을 던진다.', async () => {
      const mockGetVerificationByVid = jest.spyOn(
        service,
        'getVerificationByVid',
      )
      mockGetVerificationByVid.mockResolvedValue(newVerification)
      await expect(async () => {
        await service.verifyingCode({ ...verifyCodeDTO, code: '345' })
      }).rejects.toThrow(new ForbiddenException())

      expect(mockGetVerificationByVid).toHaveBeenCalledTimes(1)

      expect(mockGetVerificationByVid).toHaveBeenCalledWith({
        ...verifyCodeDTO,
        code: '345',
      })
    })
  })
})
