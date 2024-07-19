import { Inject } from '@nestjs/common'

import { Database } from '@/database/database.class'

import { Order } from '@/shared/dtos/common.dto'
import { Insertable, Updateable } from 'kysely'
import { Breed, DB } from '@/database/types'
import { ApiException } from '@/shared/exceptions/exception.interface'

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

  async create(breedValue: Insertable<Breed>) {
    return this.database
      .insertInto('breeds')
      .values(breedValue)
      .returning(['avatar', 'nameEN', 'nameKR'])
      .executeTakeFirst()
  }

  async update(updateValues: Updateable<DB['breeds']> & { id: string }) {
    const { id, ...values } = updateValues
    return this.database
      .updateTable('breeds')
      .set({ ...values, updatedAt: new Date() })
      .where('deletedAt', 'is', null)
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirstOrThrow(() =>
        ApiException.PLAIN_BAD_REQUEST('업데이트 실패'),
      )
  }

  async removeMany(ids: string[]) {
    return this.database
      .deleteFrom('breeds')
      .where('id', 'in', ids)
      .returning('id')
      .executeTakeFirst()
  }
}
