export const mockRepository = {
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  findOneOrFail: jest.fn(),
  delete: jest.fn(),
  update: jest.fn(),
}

export const manager = {
  getRepository: () => mockRepository,
  update: jest.fn(),
  find: jest.fn(),
}

export const dataSource = {
  createEntityManager: jest.fn(),
  manager,
}

export const mockJwtService = {
  verify: jest.fn(),
  sign: jest.fn(),
}
