import { AccessGuard } from '@/auth/guards/access.guard'
import { Controller, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

@Controller('users')
@ApiTags('Users')
@UseGuards(AccessGuard)
export class UsersController {}
