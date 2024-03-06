import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { validateOrReject } from 'class-validator'
import { TokenPayload, TokenType } from '@/shared/interfaces/token.interface'
import { UsersService } from '@/users/users.service'
import { VerificationsService } from '@/verifications/verifications.service'
import { CreateUserDTO } from '@/users/dtos/create-user.dto'
import { BaseService } from '@/shared/services/base.service'
import { Users } from '@/users/models/users.model'
import {
  VerifyCodeDTO,
  VerifyingCodeResponseDTO,
} from '@/verifications/dtos/verify-code.dto'

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

  sign(sid: string, tokenType: TokenType = 'ACCESS') {
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

  async signup(createUserDTO: CreateUserDTO) {
    /**
     * 1. 유저생성
     * 2. 인증코드 전송 (이메일 / 모바일)
     */
    const user = await this.usersService.createUser(createUserDTO)
    await this.verificationsService.createVerification(user.id)
    return user
  }

  async verifyingCode(verifyCodeDTO: VerifyCodeDTO) {
    const isValidUser =
      await this.verificationsService.verifyingCode(verifyCodeDTO)

    await this.getManager()
      .getRepository(Users)
      .update(isValidUser.id, { verified: () => 'TRUE' })
    const token = {
      accessToken: this.sign(isValidUser.id),
      refreshToken: this.sign(isValidUser.id, 'REFRESH'),
    }

    return new VerifyingCodeResponseDTO(token)
  }
}
