import { Inject } from '@nestjs/common'

import { Database } from '@/database/database.class'

import { Order } from '@/shared/dtos/common.dto'
import { Breed, DB } from '@/database/types'
import { InsertObject, Kysely, Selectable, UpdateObject } from 'kysely'

export class BreedsRepository {
  constructor(@Inject(Database) private readonly database: Database) {}

  private readonly db: Kysely<DB>

  async findAllBreeds(order: Order = Order.ASC) {
    return this.database
      .selectFrom('search_breeds')
      .orderBy('nameKR', order === Order.ASC ? 'asc' : 'desc')
      .selectAll()
      .execute()
  }

  async findOne(id: string) {
    return this.database
      .selectFrom('breeds')
      .where('breeds.id', '=', id)
      .selectAll()
      .executeTakeFirst()
  }

  async create(
    breed: InsertObject<DB, 'breeds'>,
  ): Promise<Selectable<DB['breeds']>> {
    const [newBreed] = await this.db
      .insertInto('breeds')
      .values(breed)
      .returningAll()
      .execute()
    return newBreed
  }

  async update(
    id: string,
    data: Partial<DB['breeds']>,
  ): Promise<Selectable<DB['breeds']>> {
    const [updateBreed] = await this.db
      .updateTable('breeds')
      .set(data as UpdateObject<DB, 'breeds'>)
      .where('id', '=', id)
      .returningAll()
      .execute()

    return updateBreed
  }

  async delete() {}
}
