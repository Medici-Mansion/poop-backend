import { Controller, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { AccessGuard } from '@/auth/guards/access.guard'

@Controller('users')
@ApiTags('Users')
@UseGuards(AccessGuard)
export class UsersController {}
