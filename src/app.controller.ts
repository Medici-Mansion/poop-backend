import { Controller, Get } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { Users } from '@/users/models/users.model'
import { Verification } from '@/verifications/models/verification.model'
import { Profiles } from '@/profiles/models/profiles.model'

import { BaseService } from '@/shared/services/base.service'

@Controller({
  version: '1',
})
@ApiTags('Base')
export class AppController {
  constructor(private readonly baseService: BaseService) {}
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
      this.baseService.getManager().clear(Users),
      this.baseService.getManager().clear(Verification),
      this.baseService.getManager().clear(Profiles),
    ])

    return true
  }
}
