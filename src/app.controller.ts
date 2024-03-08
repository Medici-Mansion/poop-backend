import { Controller, Get } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

@Controller({
  version: '1',
})
@ApiTags('Base')
export class AppController {
  @ApiOperation({ description: 'Health check', summary: 'Health check' })
  @Get()
  healthCheck() {
    return true
  }
}
