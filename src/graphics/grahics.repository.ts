import { Database } from '@/database/database.class'
import { Order } from '@/shared/dtos/common.dto'
import { Inject } from '@nestjs/common'
import { GetGraphicsRequestDTO } from './dtos/get-graphics-request.dto'
import { Insertable, Updateable } from 'kysely'
import { DB } from '@/database/types'
import { ApiException } from '@/shared/exceptions/exception.interface'
import { GraphicsException } from '@/graphics/graphics.exception'

export class GraphicsRepository {
  constructor(@Inject(Database) private readonly database: Database) {}

  async findOne(id: string) {
    return this.database
      .selectFrom('graphics')
      .selectAll()
      .where('deletedAt', 'is', null)
      .where('id', '=', id)
      .executeTakeFirstOrThrow(() => GraphicsException.NOTFOUND)
  }

  async findOneByName(name: string) {
    return this.database
      .selectFrom('graphics')
      .selectAll()
      .where('deletedAt', 'is', null)
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
      .where('deletedAt', 'is', null)
      .orderBy('graphics.name', order === Order.ASC ? 'asc' : 'desc')
      .selectAll()
      .execute()
  }

  async update(updateValues: Updateable<DB['graphics']> & { id: string }) {
    const { id, ...values } = updateValues
    return this.database
      .updateTable('graphics')
      .set({ ...values, updatedAt: new Date() })
      .where('deletedAt', 'is', null)
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirstOrThrow(() =>
        ApiException.PLAIN_BAD_REQUEST('업데이트 실패'),
      )
  }

  async findAllByCategoryOrType(
    getGraphicsRequestDTO: GetGraphicsRequestDTO & { order?: Order },
  ) {
    return this.database
      .selectFrom('graphics')
      .where('deletedAt', 'is', null)
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

  async removeGraphic(id: string) {
    return this.database
      .deleteFrom('graphics')
      .where('id', '=', id)
      .returningAll()
      .execute()
  }
}
