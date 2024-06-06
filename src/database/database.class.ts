import { Kysely } from 'kysely'
import { DB } from './types'

export class Database extends Kysely<DB> {}
