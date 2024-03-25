import { Test } from '@nestjs/testing'
import { dataSource } from '@test/mocks/base'
import { DataSource } from 'typeorm'
import { BaseService } from './base.service'
import { ConfigService } from '@nestjs/config'
import { REQUEST } from '@nestjs/core'
import { MANAGER_KEY } from '../constants/common.constant'

const request = { [MANAGER_KEY]: dataSource.manager }
const mockRequest = jest.fn()

describe('BaseService', () => {
  let service: BaseService
  afterEach(() => {
    jest.clearAllMocks()
  })
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: DataSource,
          useValue: dataSource,
        },
        {
          provide: ConfigService,
          useValue: ConfigService,
        },
        {
          provide: REQUEST,
          useValue: mockRequest,
        },
        BaseService,
      ],
    })

      .compile()
    service = module.get<BaseService>(BaseService)
  })

  it('should be defined.', () => {
    expect(service).toBeDefined()
  })

  describe('getManager', () => {
    it('엔티티 매니저를 반환한다.', () => {
      const result = service.getManager()
      expect(result).toEqual(dataSource.manager)
    })

    it('리퀘스트에 매니저가 있을 경우, 리퀘스트 매니저를 반환한다.', () => {
      mockRequest.mockReturnValue(request)
      const result = service.getManager()
      expect(result).toEqual(dataSource.manager)

      expect(result).toBe(request[MANAGER_KEY])
    })
  })

  describe('conf', () => {
    it('configService를 반환한다.', () => {
      const result = service.conf

      expect(result).toEqual(ConfigService)
    })
  })
})
