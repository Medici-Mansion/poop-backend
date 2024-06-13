import { Controller, Get, Inject } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { Database } from './database/database.class'
import { Api } from './shared/dtos/api.dto'

@Controller({
  version: '1',
})
@ApiTags('Base')
export class AppController {
  constructor(@Inject(Database) private readonly database: Database) {}
  @ApiOperation({ description: 'Health check', summary: 'Health check' })
  @Get()
  healthCheck() {
    return Api.OK(true)
  }

  @ApiOperation({
    description: '개발용 API로, 모든 데이터를 초기화합니다.',
    summary: 'DB초기화하기',
  })
  @Get('clear')
  async reset() {
    await this.database.transaction().execute(async (trx) => {
      await trx.deleteFrom('verification').execute()
      trx.deleteFrom('profiles').execute()
      trx.deleteFrom('users').execute()
    })
    return true
  }
}
