import { Controller, Get, Inject } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { Database } from './database/database.class'

@Controller({
  version: '1',
})
@ApiTags('Base')
export class AppController {
  constructor(@Inject(Database) private readonly dataSourceService: Database) {}
  @ApiOperation({ description: 'Health check', summary: 'Health check' })
  @Get()
  healthCheck() {
    return true
  }

  @ApiOperation({
    description: '개발용 API로, 모든 데이터를 초기화합니다.',
    summary: 'DB초기화하기',
  })
  @Get('clear')
  async reset() {
    await Promise.allSettled([
      this.dataSourceService.deleteFrom('users'),
      this.dataSourceService.deleteFrom('verification'),
      this.dataSourceService.deleteFrom('profiles'),
    ])

    return true
  }
}
