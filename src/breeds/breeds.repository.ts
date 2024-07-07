import { Inject } from '@nestjs/common'

import { Database } from '@/database/database.class'

import { Order } from '@/shared/dtos/common.dto'

export class BreedsRepository {
  constructor(@Inject(Database) private readonly database: Database) {}

  async findAllBreeds(order: Order = Order.ASC) {
    return this.database
      .selectFrom('breeds')
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
}
