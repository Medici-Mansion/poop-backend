import { AccessGuard } from '@/auth/guards/access.guard'
import { Controller, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

@Controller('verify')
@ApiTags('Verifications')
@UseGuards(AccessGuard)
export class VerificationsController {}
