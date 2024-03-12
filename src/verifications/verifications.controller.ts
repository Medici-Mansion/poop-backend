import { Controller, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { AccessGuard } from '@/auth/guards/access.guard'

@Controller('verify')
@ApiTags('Verifications')
@UseGuards(AccessGuard)
export class VerificationsController {}
