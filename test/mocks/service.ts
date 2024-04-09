import { PrismaClient } from '@prisma/client'
import { DeepMockProxy, mockDeep } from 'jest-mock-extended'
import prisma from '@/prisma/prisma'
export const mockBaseService = {
  conf: {
    get: jest.fn(),
  },
}

jest.mock('@/prisma/prisma', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}))

export const mockDataSourceService = {
  manager: prisma as unknown as DeepMockProxy<PrismaClient>,
}

export const mockRedisService = {
  findById: jest.fn(),
  setPasswordCode: jest.fn(),
  setChangePasswordCode: jest.fn(),
  getChangePasswordCode: jest.fn(),
  removeByKey: jest.fn(),
}

export const mockUsersService = {
  getUserById: jest.fn(),
  createUser: jest.fn(),
  getUserByVid: jest.fn(),
  hashPassword: jest.fn(),
}

export const mockVerificationsService = {
  createVerification: jest.fn(),
  getVerificationByVid: jest.fn(),
  verifyingCode: jest.fn(),
  removeVerification: jest.fn(),
  generateRandomString: jest.fn(),
}
export const mockExternalsService = {
  sendSMS: jest.fn(),
  sendEmail: jest.fn(),
  uploadFiles: jest.fn(),
}

export const mockBreedsService = {
  findById: jest.fn(),
}
