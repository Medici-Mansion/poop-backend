import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common'
import { FormDataRequest } from 'nestjs-form-data'
import {
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'

import { AccessGuard } from '@/auth/guards/access.guard'

import { ExtractLatestProfile } from '@/shared/decorators/latest-profile.decorator'
import { UserId } from '@/shared/decorators/user-id.decorator'
import { ApiPoopSecurity } from '@/shared/decorators/api-poop-security.decorator'
import { LatestProfile } from '@/shared/decorators/latest-profile.decorator'

import { ProfilesService } from '@/profiles/profiles.service'

import { TokenPayload } from '@/shared/interfaces/token.interface'

import { CreateProfileDTO } from '@/profiles/dtos/create-profile.dto'
import { LoginProfileDTO } from '@/profiles/dtos/login-profile.dto'
import { GetProfileDTO, ProfileDTO } from '@/profiles/dtos/get-profile.dto'
import { Api } from '@/shared/dtos/api.dto'

@ApiPoopSecurity()
@ApiTags('Profiles')
@Controller('profiles')
@UseGuards(AccessGuard)
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post()
  @ApiOperation({
    summary: '프로필 사용하기',
    description: '사용할 프로필을 선택합니다.',
  })
  @HttpCode(200)
  @ApiOkResponse({
    type: Boolean,
    status: '2XX',
  })
  loginProfile(
    @UserId() { uid }: TokenPayload,
    @Body() loginProfileDTO: LoginProfileDTO,
  ) {
    return Api.OK(this.profilesService.loginProfile(uid, loginProfileDTO))
  }

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
  createProfile(
    @UserId() { uid }: TokenPayload,
    @Body() createProfileDTO: CreateProfileDTO,
  ) {
    return Api.OK(this.profilesService.createProfile(uid, createProfileDTO))
  }

  @Get()
  @ApiOperation({
    summary: '나의 프로필 목록 조회',
    description: '내가 만든 프로필 목록을 조회한다',
  })
  @ApiOkResponse({
    type: [GetProfileDTO],
  })
  getProfileList(@UserId() { uid }: TokenPayload) {
    return Api.OK(this.profilesService.getMyProfileList(uid))
  }

  @Get('latest')
  @ApiOperation({
    summary: '최근 접속 프로필 조회',
    description: '최근 접속한 프로필을 조회한다',
  })
  @ApiOkResponse({
    type: ProfileDTO,
  })
  @LatestProfile()
  getLatestProfile(@ExtractLatestProfile() profile: ProfileDTO) {
    return Api.OK(profile)
  }
}
