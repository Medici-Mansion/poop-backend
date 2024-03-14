import { Body, Controller, Patch, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { AccessGuard } from '@/auth/guards/access.guard'

import { UsersService } from '@/users/users.service'

import { Public } from '@/shared/decorators/public.decorator'

import { PatchPasswordDTO } from '@/users/dtos/patch-password.dto'

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
}
