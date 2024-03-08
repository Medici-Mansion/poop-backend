import { Body, Controller, Put, UseGuards } from '@nestjs/common'
import { FormDataRequest } from 'nestjs-form-data'
import {
  ApiConsumes,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'

import { AccessGuard } from '@/auth/guards/access.guard'

import { UserId } from '@/shared/decorators/user-id.decorator'
import { ApiPoopSecurity } from '@/shared/decorators/api-poop-security.decorator'

import { ProfilesService } from '@/profiles/profiles.service'

import { TokenPayload } from '@/shared/interfaces/token.interface'

import { CreateProfileDTO } from '@/profiles/dtos/create-profile.dto'
import { Transaction } from '@/shared/decorators/transaction.decorator'

@ApiPoopSecurity()
@ApiTags('Profiles')
@Controller('profiles')
@UseGuards(AccessGuard)
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Put()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: '프로필 생성',
    description: '프로필을 생성합니다.',
  })
  @ApiCreatedResponse({
    type: Boolean,
  })
  @FormDataRequest()
  @Transaction()
  createProfile(
    @UserId() { uid }: TokenPayload,
    @Body() createProfileDTO: CreateProfileDTO,
  ) {
    return this.profilesService.createProfile(uid, createProfileDTO)
  }
}
