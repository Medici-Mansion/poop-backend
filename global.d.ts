import { Env } from '@/shared/interfaces/env.interface'

declare namespace NodeJS {
  interface ProcessEnv extends Env {}
}
