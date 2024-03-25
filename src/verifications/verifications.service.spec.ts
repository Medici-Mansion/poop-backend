import { Test } from '@nestjs/testing'
import { VerificationsService } from '@/verifications/verifications.service'
import { BaseService } from '@/shared/services/base.service'
import { mockBaseService } from '@test/mocks/service'
import { Verification } from './models/verification.model'

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
})
