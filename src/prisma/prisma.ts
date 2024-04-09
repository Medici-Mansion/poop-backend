import { PrismaClient } from '@prisma/client'

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

export default prisma
