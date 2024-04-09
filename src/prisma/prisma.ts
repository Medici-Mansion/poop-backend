import { PrismaClient } from '@prisma/client'
import { DeepMockProxy } from 'jest-mock-extended'

const prisma = new PrismaClient({
  log: ['query', 'error', 'info', 'warn'],
  transactionOptions: {
    isolationLevel: 'RepeatableRead',
  },
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
})

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>

export default prisma
