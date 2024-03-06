import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { validateOrReject } from 'class-validator'

import { TokenPayload, TokenType } from '@/shared/interfaces/token.interface'

import { UsersService } from '@/users/users.service'
import { VerificationsService } from '@/verifications/verifications.service'
import { BaseService } from '@/shared/services/base.service'

import { Users } from '@/users/models/users.model'

import {
  CreateUserDTO,
  CreateUserResponseDTO,
} from '@/users/dtos/create-user.dto'
import {
  VerifyCodeDTO,
  VerifyingCodeResponseDTO,
} from '@/verifications/dtos/verify-code.dto'
import { LoginRequestDTO } from '@/auth/dtos/login.dto'

@Injectable()
export class AuthService extends BaseService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly verificationsService: VerificationsService,
  ) {
    super()
  }

  verify(token: string): TokenPayload {
    try {
      return this.jwtService.verify<TokenPayload>(token, {
        secret: process.env.JWT_SECRET,
      })
    } catch (e) {
      throw new UnauthorizedException()
    }
  }

  sign(sid: string, tokenType: TokenType = 'ACCESS'): string {
    try {
      const token: TokenPayload = {
        sid,
      }

      validateOrReject(token)

      return this.jwtService.sign(token, {
        expiresIn:
          tokenType === 'ACCESS'
            ? process.env.ACCESS_EXPIRES_IN
            : process.env.REFRESH_EXPIRES_IN,
        secret: process.env.JWT_SECRET,
      })
    } catch (error) {
      console.log(error)
      throw new ForbiddenException()
    }
  }

  async signup(createUserDTO: CreateUserDTO): Promise<CreateUserResponseDTO> {
    /**
     * 1. 유저생성
     * 2. 인증코드 전송 (이메일 / 모바일)
     */
    const user = await this.usersService.createUser(createUserDTO)
    await this.verificationsService.createVerification(user.id)
    return user
  }

  async verifyingCode(
    verifyCodeDTO: VerifyCodeDTO,
  ): Promise<VerifyingCodeResponseDTO> {
    const isValidUser =
      await this.verificationsService.verifyingCode(verifyCodeDTO)

    await this.getManager()
      .getRepository(Users)
      .update(isValidUser.id, { verified: () => 'TRUE' })

    return this.publishToken(isValidUser.id)
  }

  async login(
    loginRequestDTO: LoginRequestDTO,
  ): Promise<VerifyingCodeResponseDTO> {
    const usersRepository = this.getManager().getRepository(Users)
    const foundUser = await usersRepository.findOne({
      where: {
        id: loginRequestDTO.id,
      },
    })

    if (!foundUser) throw new NotFoundException()

    const validPassword = await foundUser.checkPassword(
      loginRequestDTO.password,
    )

    if (!validPassword) throw new BadRequestException()
    // TODO: 커스텀에러를 통해 인증되지 않은 계정의 로그인 요청 분기 필요합니다.
    if (!foundUser.verified)
      throw new ForbiddenException('인증되지 않은 계정입니다.')

    return this.publishToken(foundUser.id)
  }

  private publishToken(id: string): VerifyingCodeResponseDTO {
    const token = {
      accessToken: this.sign(id),
      refreshToken: this.sign(id, 'REFRESH'),
    }

    return new VerifyingCodeResponseDTO(token)
  }
}
