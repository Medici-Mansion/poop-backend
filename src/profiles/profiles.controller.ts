import { ExtractLatestProfile } from './../shared/decorators/latest-profile.decorator'
import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common'
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
import { Profiles } from './models/profiles.model'

import { LatestProfile } from '@/shared/decorators/latest-profile.decorator'
import { LoginProfileDTO } from './dtos/login-profile.dto'

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

  @Get()
  getProfileList(@UserId() { uid }: TokenPayload) {
    return this.profilesService.getMyProfileList(uid)
  }

  @Get('latest')
  @LatestProfile()
  getLatestProfile(@ExtractLatestProfile() profile: Profiles) {
    return profile
  }

  @Post('login')
  loginProfile(
    @UserId() { uid }: TokenPayload,
    @Body() loginProfileDTO: LoginProfileDTO,
  ) {
    return this.profilesService.loginProfile(uid, loginProfileDTO)
  }
}
