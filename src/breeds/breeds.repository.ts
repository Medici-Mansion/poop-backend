import { Inject } from '@nestjs/common'

import { Database } from '@/database/database.class'

import { Insertable, Updateable } from 'kysely'
import { Breed, DB } from '@/database/types'
import { ApiException } from '@/shared/exceptions/exception.interface'
import { executeWithCursorPagination } from 'kysely-paginate'
import { OrderBreedDTO } from './dtos/request/get-breed.dto'

export class BreedsRepository {
  constructor(@Inject(Database) private readonly database: Database) {}

  async findAllBreedsWithCursor(orderBreedDTO: OrderBreedDTO) {
    const query = this.database.selectFrom('breeds').selectAll()
    const result = await executeWithCursorPagination(query, {
      perPage: 10,
      after: orderBreedDTO.cursor,
      fields: [
        {
          expression: orderBreedDTO.orderKey || 'createdAt',
          direction: orderBreedDTO.direction || 'asc',
        },
      ],
      parseCursor: (cursor) =>
        cursor[orderBreedDTO.orderKey || ('createdAt' as any)].toString(),
    })
    return result
  }

  async findAllBreeds() {
    return this.database.selectFrom('breeds').selectAll().execute()
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
      .returningAll()
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
      .returningAll()
      .execute()
  }
}
