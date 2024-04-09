import { PrismaClient } from '@prisma/client'
import { DeepMockProxy, mockDeep } from 'jest-mock-extended'
import prisma from '@/prisma/prisma'

jest.mock('@/prisma/prisma', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>({
    funcPropSupport: true,
  }),
}))

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>
