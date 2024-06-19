import { OrderByDirectionExpression } from 'kysely'
import { Inject } from '@nestjs/common'

import { Database } from '@/database/database.class'

import {
  GetBreedRequestDTO,
  GetBreedResponseDTO,
} from '@/breeds/dtos/get-breed.dto'
import { Order } from '@/shared/dtos/common.dto'
import { WithCursor } from '@/shared/dtos/with-cursor.dto'

export class BreedsRepository {
  constructor(@Inject(Database) private readonly database: Database) {}

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

  async findByCursor(getBreedRequestDTO: GetBreedRequestDTO) {
    const limit = getBreedRequestDTO.limit || 10
    const order = getBreedRequestDTO.order?.toLowerCase() || 'asc'
    const query = this.database
      .selectFrom('search_breeds')
      .selectAll()
      .$if(!!getBreedRequestDTO.cursor, (qb) =>
        qb.where('nameKR', '>', getBreedRequestDTO.cursor!),
      )
      .$if(!!getBreedRequestDTO.searchKey, (qb) =>
        qb.where(
          'searchKeyCode',
          '=',
          getBreedRequestDTO.searchKey!.charCodeAt(0),
        ),
      )
      .$if(!!order, (qb) =>
        qb.orderBy('nameKR', order as OrderByDirectionExpression),
      )
      .$if(!!limit, (qb) => qb.limit(limit + 1))

    const breeds = await query.execute()

    const hasNextPage = breeds.length > limit
    if (hasNextPage) breeds.pop()

    const nextCursor = hasNextPage ? breeds[breeds.length - 1].nameKR : null

    return new WithCursor(
      breeds.map((breed) => new GetBreedResponseDTO(breed)),
      { nextCursor, hasNextPage },
    )
  }
}
