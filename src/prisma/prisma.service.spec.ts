import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from './prisma.service'
import { BaseService } from '@/shared/services/base.service'
import { mockBaseService } from '@test/mocks/service'
import { PrismaClient } from '@prisma/client'

const Client = {
  $extends: jest.fn(),
  $disconnect: jest.fn(),
  $connect: jest.fn(),
  $transaction: jest.fn(),
}
describe('PrismaService', () => {
  let service: PrismaService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaService,
        {
          provide: BaseService,
          useValue: mockBaseService,
        },
        {
          provide: PrismaClient,
          useValue: Client,
        },
      ],
    }).compile()

    service = module.get<PrismaService>(PrismaService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
