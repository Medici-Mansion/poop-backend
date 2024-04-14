import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

import { AccessGuard } from '@/auth/guards/access.guard'

import { UsersService } from '@/users/users.service'

import { Public } from '@/shared/decorators/public.decorator'

import { PatchPasswordDTO } from '@/users/dtos/patch-password.dto'
import { TokenPayload } from '@/shared/interfaces/token.interface'
import { UserId } from '@/shared/decorators/user-id.decorator'

@Controller('users')
@ApiTags('Users')
@UseGuards(AccessGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Patch('password')
  patchPassword(@Body() patchPasswordDTO: PatchPasswordDTO) {
    return this.usersService.changePassword(patchPasswordDTO)
  }

  @ApiOperation({
    summary: '내 정보 조회',
    description: '나의 로그인 정보를 조회한다.',
  })
  @Get('me')
  getMe(@UserId() { uid }: TokenPayload) {
    return this.usersService.getMe(uid)
  }
}
