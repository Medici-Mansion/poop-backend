import { FastifyReply } from 'fastify'
import { AuthService } from '@/auth/auth.service'
import { Public } from '@/shared/decorators/public.decorator'
import { Transaction } from '@/shared/decorators/transaction.decorator'
import {
  CreateUserDTO,
  CreateUserResponseDTO,
} from '@/users/dtos/create-user.dto'
import {
  VerifyCodeDTO,
  VerifyingCodeResponseDTO,
} from '@/verifications/dtos/verify-code.dto'
import { Body, Controller, Post, Put, Res } from '@nestjs/common'
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @ApiOperation({
    summary: '회원가입 / 사용자 생성',
    description:
      '사용자 생성, 회원가입 용도로 사용됩니다. \n 정상응답 시 인증코드가 발송됩니다.',
  })
  @ApiCreatedResponse({
    type: CreateUserResponseDTO,
  })
  @Public()
  @Put('signup')
  @Transaction()
  async createUser(@Body() createUserDTO: CreateUserDTO) {
    return this.authService.signup(createUserDTO)
  }

  /**
   *
   * @param {VerifyCodeDTO} verifyCodeDTO
   * @description 인증 완료 시 로그인동작과 같은 응답 반환
   */
  @ApiOperation({
    summary: '인증번호 검증 API',
    description: '인증코드를 통한 계정정보 인증',
  })
  @ApiOkResponse({
    type: VerifyingCodeResponseDTO,
    description: '엑세스 토큰. 유효시간 1시간\n리프레시 토큰. 유효시간 30일',
  })
  @Public()
  @Post()
  @Transaction()
  async verifyingCode(
    @Body() verifyCodeDTO: VerifyCodeDTO,
    @Res({ passthrough: true }) response: FastifyReply,
  ): Promise<VerifyingCodeResponseDTO> {
    const token = await this.authService.verifyingCode(verifyCodeDTO)

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
}
