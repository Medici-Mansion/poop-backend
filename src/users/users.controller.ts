import { Body, Controller, Get, Patch, Query, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

import { AccessGuard } from '@/auth/guards/access.guard'

import { UsersService } from '@/users/users.service'

import { Public } from '@/shared/decorators/public.decorator'

import { PatchPasswordDTO } from '@/users/dtos/patch-password.dto'
import { TokenPayload } from '@/shared/interfaces/token.interface'
import { UserId } from '@/shared/decorators/user-id.decorator'
import { CheckNicknameDTO } from './dtos/check-nickname.dto'
import { Api } from '@/shared/dtos/api.dto'

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Patch('password')
  patchPassword(@Body() patchPasswordDTO: PatchPasswordDTO) {
    return this.usersService.changePassword(patchPasswordDTO)
  }

  @Public()
  @Get('nickname')
  checkNicknameDuplicated(@Query() checkNicknameDTO: CheckNicknameDTO) {
    // FIXME
    const dto = { nickname: checkNicknameDTO.nickname.toLowerCase() }
    return this.usersService.checkNicknameDuplicated(dto)
  }

  @ApiOperation({
    summary: '내 정보 조회',
    description: '나의 로그인 정보를 조회한다.',
  })
  @UseGuards(AccessGuard)
  @Get('me')
  async getMe(@UserId() { uid }: TokenPayload) {
    const response = await this.usersService.getMe(uid)
    return Api.OK(response)
  }
}
