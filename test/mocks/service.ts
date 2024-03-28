import { dataSource } from '@test/mocks/base'

export const mockBaseService = {
  getManager() {
    return dataSource.manager
  },

  conf: {
    get: jest.fn(),
  },
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
