import { Database } from '@/database/database.class'
import { Order } from '@/shared/dtos/common.dto'
import { Inject } from '@nestjs/common'
import { GetGraphicsRequestDTO } from './dtos/get-graphics-request.dto'
import { Insertable } from 'kysely'
import { DB } from '@/database/types'

export class GraphicsRepository {
  constructor(@Inject(Database) private readonly database: Database) {}

  async findOneByName(name: string) {
    return this.database
      .selectFrom('graphics')
      .where('name', '=', name)
      .executeTakeFirst()
  }

  async create(insertValue: Insertable<DB['graphics']>) {
    return this.database
      .insertInto('graphics')
      .values(insertValue)
      .returningAll()
      .execute()
  }

  async findAll(order: Order = Order.ASC) {
    return this.database
      .selectFrom('graphics')
      .orderBy('graphics.name', order === Order.ASC ? 'asc' : 'desc')
      .selectAll()
      .execute()
  }

  async findAllByCategoryOrType(
    getGraphicsRequestDTO: GetGraphicsRequestDTO & { order?: Order },
  ) {
    return this.database
      .selectFrom('graphics')
      .$if(!!getGraphicsRequestDTO.category, (qb) =>
        qb.where('category', '=', getGraphicsRequestDTO.category),
      )
      .$if(!!getGraphicsRequestDTO.graphicType, (qb) =>
        qb.where('type', '=', getGraphicsRequestDTO.graphicType),
      )
      .where('url', 'is not', null)
      .orderBy(
        'graphics.name',
        getGraphicsRequestDTO.order === Order.ASC ? 'asc' : 'desc',
      )
      .selectAll()
      .execute()
  }
}
