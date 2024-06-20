import { Database } from '@/database/database.class'
import { Order } from '@/shared/dtos/common.dto'
import { Inject } from '@nestjs/common'

export class GraphicsRepository {
  constructor(@Inject(Database) private readonly database: Database) {}

  async findAll(order: Order = Order.ASC) {
    return this.database
      .selectFrom('graphics')
      .orderBy('graphics.name', order === Order.ASC ? 'asc' : 'desc')
      .selectAll()
      .execute()
  }
}
