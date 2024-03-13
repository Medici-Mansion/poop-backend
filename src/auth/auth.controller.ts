/* eslint-disable @typescript-eslint/ban-types */
import { FastifyReply } from 'fastify'
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common'
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'

import { Transaction } from '@/shared/decorators/transaction.decorator'

import { AuthService } from '@/auth/auth.service'

import { CreateUserDTO } from '@/users/dtos/create-user.dto'
import {
  VerifyCodeDTO,
  VerifyingCodeResponseDTO,
} from '@/verifications/dtos/verify-code.dto'
import { LoginRequestDTO } from '@/auth/dtos/login.dto'
import { GetUserByVidDTO } from '@/verifications/dtos/get-user-by-vid.dto'

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @ApiOperation({
    summary: '회원가입 / 사용자 생성',
    description:
      '사용자 생성, 회원가입 용도로 사용됩니다. 정상응답 시 인증코드가 발송됩니다.',
  })
  @ApiCreatedResponse({
    type: Boolean,
  })
  @Put('signup')
  @Transaction()
  async createUser(@Body() createUserDTO: CreateUserDTO): Promise<boolean> {
    if (!createUserDTO.email && !createUserDTO.phone)
      throw new BadRequestException(['이메일 또는 전화번호는 필수에요.'])
    return this.authService.signup(createUserDTO)
  }

  @ApiOperation({
    summary: '인증번호 요청 API',
    description: 'VID와 매칭되는 매체를 통해 인증번호를 전송받는다',
  })
  @ApiOkResponse({
    type: Boolean,
    description: '선택한 매체를 통해 인증번호 전송',
  })
  @Get('verify')
  @Transaction()
  async requestVerificationCode(@Query() getUserByVidDTO: GetUserByVidDTO) {
    return this.authService.requestVerificationCode(getUserByVidDTO)
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
  @ApiOkResponse({
    type: Boolean,
    description: '인증코드 검증 완료 처리',
  })
  @HttpCode(200)
  @Post('verify')
  @Transaction()
  async verifyingCode(@Body() verifyCodeDTO: VerifyCodeDTO): Promise<boolean> {
    return this.authService.verifyingCode(verifyCodeDTO)
  }

  @ApiOperation({
    description:
      '아이디와 패스워드를 통해 로그인합니다. 엑세스토큰과 리프레시토큰을 응답하며, 쿠키에 자동저장됩니다. 인증코드를 통한 인증을 하지 않은 경우, 로그인되지 않습니다.',
    summary: '로그인',
  })
  @ApiOkResponse({
    type: VerifyingCodeResponseDTO,
    description: '로그인 성공 시 토큰이 발행됩니다.',
  })
  @Post('login')
  @HttpCode(200)
  async login(
    @Body() loginRequestDTO: LoginRequestDTO,
    @Res({ passthrough: true }) response: FastifyReply,
  ): Promise<VerifyingCodeResponseDTO> {
    const token = await this.authService.login(loginRequestDTO)
    response.setCookie('access_token', token.accessToken, {
      path: '/',
      maxAge: 60 * 60,
      secure: true,
      httpOnly: true,
      sameSite: 'lax',
    })
    response.setCookie('refresh_token', token.refreshToken, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
      secure: true,
      httpOnly: true,
      sameSite: 'lax',
    })
    return token
  }

  @ApiOperation({
    summary: '인증번호 요청 API (비밀번호찾기)',
    description:
      'VID와 매칭되는 매체를 통해 인증번호를 전송받는다 1시간의 제한시간이 있으며, 유효시간이 지나면 인증이 불가능하다',
  })
  @ApiOkResponse({
    type: Boolean,
    description: '선택한 매체를 통해 인증번호 전송',
  })
  @Get('password-code')
  @Transaction()
  getChangePasswordCode(@Query() getUserByVidDTO: GetUserByVidDTO) {
    return this.authService.getChangePasswordCode(getUserByVidDTO)
  }

  @ApiOperation({
    summary: '인증번호 검증 API (비밀번호찾기)',
    description: '인증코드를 통한 계정정보 인증',
  })
  @ApiOkResponse({
    schema: {
      type: 'string',
      example: 'ERJ492WE338EWEQ1',
      description: '비밀번호 변경 요청 시 전달해야할 토큰',
    },
    description:
      '인증코드 검증 완료 처리 (비밀번호찾기) 응답으로 16자리 문자열이 오는데, 비밀번호 변경 시 해당 문자열을 함께 던져야함',
  })
  @HttpCode(200)
  @Post('password-code')
  @Transaction()
  verifyChangePasswordCode(@Body() verifyCodeDTO: VerifyCodeDTO) {
    return this.authService.verifyChangePasswordCode(verifyCodeDTO)
  }
}
