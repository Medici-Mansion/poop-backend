import { GetUserByVidDTO } from '../verifications/dtos/get-user-by-vid.dto'
import { ExternalsService } from '@/externals/externals.service'
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
  VerificationType,
  VerifyCodeDTO,
  VerifyingCodeResponseDTO,
} from '@/verifications/dtos/verify-code.dto'
import { LoginRequestDTO } from '@/auth/dtos/login.dto'
import { EmailTemplateName } from '@poop/common'

@Injectable()
export class AuthService extends BaseService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly verificationsService: VerificationsService,
    private readonly externalsService: ExternalsService,
  ) {
    super()
  }

  async signup(createUserDTO: CreateUserDTO): Promise<CreateUserResponseDTO> {
    const user = await this.usersService.createUser(createUserDTO)
    await this.verificationsService.createVerification(user.id)

    return user
  }

  async requestVerificationCode(getUserByVidDTO: GetUserByVidDTO) {
    const foundVerification =
      await this.verificationsService.getUserByVid(getUserByVidDTO)
    foundVerification.code = foundVerification.getNewCode()
    if (getUserByVidDTO.type === VerificationType.PHONE) {
      await this.externalsService.sendSMS(
        `POOP! \n 인증코드: ${foundVerification.code}`,
        getUserByVidDTO.vid,
      )
    } else if (getUserByVidDTO.type === VerificationType.EMAIL) {
      await this.externalsService.sendEmail(
        '[PooP!] 계정인증코드입니다.',
        getUserByVidDTO.vid,
        EmailTemplateName.CONFIRM_EMAIL,
        [
          {
            key: 'code',
            value: foundVerification.code,
          },
        ],
      )
    }
    await foundVerification.save()
    return true
  }

  async verifyingCode(
    verifyCodeDTO: VerifyCodeDTO,
  ): Promise<VerifyingCodeResponseDTO> {
    const isValidUser =
      await this.verificationsService.verifyingCode(verifyCodeDTO)

    await this.getManager()
      .getRepository(Users)
      .update(isValidUser.id, {
        verified: () => 'NOW()',
      })

    return this.publishToken(isValidUser.id)
  }

  async login(
    loginRequestDTO: LoginRequestDTO,
  ): Promise<VerifyingCodeResponseDTO> {
    const foundUser = await this.usersService.getUserByAccountId(
      loginRequestDTO.id,
    )

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

  verify(token: string): TokenPayload {
    try {
      return this.jwtService.verify<TokenPayload>(token, {
        secret: this.configService.get('JWT_SECRET'),
      })
    } catch (e) {
      throw new UnauthorizedException()
    }
  }

  sign(uid: string, tokenType: TokenType = 'ACCESS'): string {
    try {
      const token: TokenPayload = {
        uid,
      }

      validateOrReject(token)

      return this.jwtService.sign(token, {
        expiresIn:
          tokenType === 'ACCESS'
            ? this.configService.get('ACCESS_EXPIRES_IN')
            : this.configService.get('REFRESH_EXPIRES_IN'),
        secret: this.configService.get('JWT_SECRET'),
      })
    } catch (error) {
      throw new ForbiddenException()
    }
  }

  private async publishToken(id: string): Promise<VerifyingCodeResponseDTO> {
    const token = {
      accessToken: this.sign(id),
      refreshToken: this.sign(id, 'REFRESH'),
    }

    await this.getManager().getRepository(Users).update(id, {
      refreshToken: token.refreshToken,
    })

    return new VerifyingCodeResponseDTO(token)
  }
}
