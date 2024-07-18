/* eslint-disable @typescript-eslint/ban-types */
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

import { AuthService } from '@/auth/auth.service'

import { CreateUserDTO } from '@/users/dtos/create-user.dto'
import {
  VerifyCodeDTO,
  VerifyingCodeResponseDTO,
} from '@/verifications/dtos/verify-code.dto'
import { LoginRequestDTO } from '@/auth/dtos/login.dto'
import { GetUserByVidDTO } from '@/users/dtos/get-user-by-vid.dto'

import { PlainToken, Refresh } from '@/shared/decorators/refresh.decorator'

import { AccessGuard } from '@/auth/guards/access.guard'
import { ApiResult } from '@/shared/decorators/swagger/response.decorator'
import { Api } from '@/shared/dtos/api.dto'
import { CommonCodes } from '@/shared/errors/code/common.code'
import { ChangePasswordCodeResponseDTO } from './dtos/change-password-code-response.dto'

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @ApiOperation({
    summary: '회원가입 / 사용자 생성',
    description: '사용자 생성, 회원가입 용도로 사용됩니다.',
  })
  @ApiResult(CommonCodes.CREATED, [
    {
      model: Boolean,
      exampleDescription:
        '회원 성성 완료 후 (인증번호 요청 API)인증코드를 통해 verify 필요.',
      exampleTitle: '회원 생성 완료',
    },
  ])
  @Put('signup')
  async createUser(
    @Body() createUserDTO: CreateUserDTO,
  ): Promise<Api<boolean>> {
    await this.authService.signup(createUserDTO)
    return Api.OK(true)
  }

  @ApiOperation({
    summary: '인증번호 요청 API',
    description: 'VID와 매칭되는 매체를 통해 인증번호를 전송받는다',
  })
  @ApiResult(CommonCodes.OK, [
    {
      model: Boolean,
      exampleDescription:
        '인증이 필요한 회원 ( verified 하지 않은 회원 ) 일 경우 전송 성공',
      exampleTitle: '인증번호 전송 성공',
    },
  ])
  @Get('verify')
  async requestVerificationCode(
    @Query() getUserByVidDTO: GetUserByVidDTO,
  ): Promise<Api<boolean>> {
    await this.authService.requestVerificationCode(getUserByVidDTO)
    return Api.OK(true)
  }

  /**
   *
   * @param {VerifyCodeDTO} verifyCodeDTO
   * @description
   */
  @ApiOperation({
    summary: '인증번호 검증 API',
    description: '인증코드를 통한 계정정보 인증',
  })
  @ApiResult(CommonCodes.OK, [
    {
      model: Boolean,
      exampleDescription: '인증번호 검증 성공 이후 로그인 가능',
      exampleTitle: '인증번호 검증 성공',
    },
  ])
  @Post('verify')
  @HttpCode(200)
  async verifyingCode(
    @Body() verifyCodeDTO: VerifyCodeDTO,
  ): Promise<Api<boolean>> {
    await this.authService.verifyingCode(verifyCodeDTO)
    return Api.OK(true)
  }

  @ApiOperation({
    description:
      '아이디와 패스워드를 통해 로그인합니다. 엑세스토큰과 리프레시토큰을 응답하며, 쿠키에 자동저장됩니다. 인증코드를 통한 인증을 하지 않은 경우, 로그인되지 않습니다.',
    summary: '로그인',
  })
  @ApiResult(CommonCodes.OK, [
    {
      model: VerifyingCodeResponseDTO,
      exampleDescription: '로그인 성공 시 토큰이 발행됩니다.',
      exampleTitle: '로그인 성공',
    },
  ])
  @Post('login')
  @HttpCode(200)
  async login(
    @Body() loginRequestDTO: LoginRequestDTO,
  ): Promise<Api<VerifyingCodeResponseDTO>> {
    const newVerifyToken = await this.authService.login(loginRequestDTO)
    return Api.OK(newVerifyToken)
  }

  @UseGuards(AccessGuard)
  @Refresh()
  @ApiOperation({
    summary: '새로운 토큰발급',
    description: 'refresh token을 통해 새로운 토큰을 발급한다',
  })
  @ApiResult(CommonCodes.OK, [
    {
      model: VerifyingCodeResponseDTO,
      exampleDescription: '재발급 성공 시 토큰이 발행됩니다.',
      exampleTitle: '재발급 성공',
    },
  ])
  @HttpCode(200)
  @Post('refresh')
  async refresh(
    @PlainToken() token: string,
  ): Promise<Api<VerifyingCodeResponseDTO>> {
    const newToken = await this.authService.refresh(token)
    return Api.OK(newToken)
  }

  @ApiOperation({
    summary: '인증번호 요청 API (비밀번호찾기)',
    description:
      'VID와 매칭되는 매체를 통해 인증번호를 전송받는다 1시간의 제한시간이 있으며, 유효시간이 지나면 인증이 불가능하다',
  })
  @ApiResult(CommonCodes.OK, [
    {
      model: Boolean,
      exampleDescription: '선택한 매체를 통해 인증번호 전송',
      exampleTitle: '패스워드 변경 코드 전송',
    },
  ])
  @Get('password-code')
  async getChangePasswordCode(
    @Query() getUserByVidDTO: GetUserByVidDTO,
  ): Promise<Api<boolean>> {
    const response =
      await this.authService.getChangePasswordCode(getUserByVidDTO)
    return Api.OK(response)
  }

  @ApiOperation({
    summary: '인증번호 검증 API (비밀번호찾기)',
    description: '인증코드를 통한 계정정보 인증',
  })
  @ApiResult(CommonCodes.OK, [
    {
      model: ChangePasswordCodeResponseDTO,
      exampleDescription:
        '인증코드 검증 완료 처리 (비밀번호찾기) 응답으로 16자리 문자열이 오는데, 비밀번호 변경 시 해당 문자열을 함께 던져야함',
      exampleTitle: '패스워드 변경 코드 전송',
    },
  ])
  @HttpCode(200)
  @Post('password-code')
  async verifyChangePasswordCode(
    @Body() verifyCodeDTO: VerifyCodeDTO,
  ): Promise<Api<ChangePasswordCodeResponseDTO>> {
    const changePasswordCodeResponseDTO =
      await this.authService.verifyChangePasswordCode(verifyCodeDTO)
    return Api.OK(changePasswordCodeResponseDTO)
  }
}
