import { prismaMock } from './prisma'
import { PrismaClient } from '@prisma/client'
import { DeepMockProxy } from 'jest-mock-extended'

export const mockBaseService = {
  conf: {
    get: jest.fn(),
  },
}

export const mockDataSourceService = {
  manager: prismaMock as unknown as DeepMockProxy<PrismaClient>,
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
