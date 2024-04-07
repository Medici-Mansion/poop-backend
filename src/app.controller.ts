import { PrismaService } from './prisma/prisma.service'
import { Controller, Get } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

@Controller({
  version: '1',
})
@ApiTags('Base')
export class AppController {
  constructor(private readonly prismaService: PrismaService) {}
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
      this.prismaService.user.deleteMany(),
      this.prismaService.verification.deleteMany(),
      this.prismaService.profile.deleteMany(),
    ])

    return true
  }
}
