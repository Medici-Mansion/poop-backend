import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { validateOrReject } from 'class-validator'
import { InjectRedis } from '@liaoliaots/nestjs-redis'
import { Redis } from 'ioredis'
import { FindOptionsWhere } from 'typeorm'

import { TokenPayload, TokenType } from '@/shared/interfaces/token.interface'

import { UsersService } from '@/users/users.service'
import { VerificationsService } from '@/verifications/verifications.service'
import { BaseService } from '@/shared/services/base.service'
import { ExternalsService } from '@/externals/externals.service'

import { Users } from '@/users/models/users.model'

import { CreateUserDTO } from '@/users/dtos/create-user.dto'
import {
  VerificationType,
  VerifyingCodeResponseDTO,
  VerifyCodeDTO,
} from '@/verifications/dtos/verify-code.dto'
import { LoginRequestDTO } from '@/auth/dtos/login.dto'
import { GetUserByVidDTO } from '@/verifications/dtos/get-user-by-vid.dto'
import { RefreshDTO } from './dtos/refresh.dto'

import { EmailTemplateName } from '@/shared/constants/common.constant'

@Injectable()
export class AuthService extends BaseService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly verificationsService: VerificationsService,
    private readonly externalsService: ExternalsService,
    @InjectRedis() private readonly redis: Redis,
  ) {
    super()
  }

  async signup(createUserDTO: CreateUserDTO): Promise<boolean> {
    const user = await this.usersService.createUser(createUserDTO)
    await this.verificationsService.createVerification(user.id)

    return true
  }

  async requestVerificationCode(getUserByVidDTO: GetUserByVidDTO) {
    const foundVerification =
      await this.verificationsService.getUserByVid(getUserByVidDTO)
    foundVerification.code = this.verificationsService.generateRandomString()
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

  async verifyingCode(verifyCodeDTO: VerifyCodeDTO): Promise<boolean> {
    const foundVerification =
      await this.verificationsService.verifyingCode(verifyCodeDTO)

    await this.getManager()
      .getRepository(Users)
      .update(foundVerification.user.id, {
        verified: () => 'NOW()',
      })

    await this.verificationsService.removeVerification(foundVerification.id)
    return true
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

    if (!validPassword) throw new BadRequestException('비밀번호가 다릅니다.')
    // TODO: 커스텀에러를 통해 인증되지 않은 계정의 로그인 요청 분기 필요합니다.
    if (!foundUser.verified)
      throw new ForbiddenException('인증되지 않은 계정입니다.')

    return this.publishToken(foundUser.id)
  }

  /**
   * TODO: 리펙토링 필요
   * 이미 인증된 경우 or 인증되지 않은 경우 모두 사용 가능 해야 함
   * @param getUserByVidDTO
   * @returns
   */
  async getChangePasswordCode(getUserByVidDTO: GetUserByVidDTO) {
    const userWhereCond: FindOptionsWhere<Users> = {
      [getUserByVidDTO.type.toLowerCase()]: getUserByVidDTO.vid,
    }
    const repository = this.getManager().getRepository(Users)
    const foundUser = await repository.findOne({
      where: {
        ...userWhereCond,
      },
    })

    if (!foundUser) {
      throw new NotFoundException()
    }
    const code = this.verificationsService.generateRandomString()
    if (getUserByVidDTO.type === VerificationType.PHONE) {
      await this.externalsService.sendSMS(
        `POOP! \n 인증코드: ${code}`,
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
            value: code,
          },
        ],
      )
    }
    await this.redis.set(foundUser.id, code, 'EX', 60 * 60)
    return true
  }

  async verifyChangePasswordCode(verifyCodeDTO: VerifyCodeDTO) {
    const userWhereCond: FindOptionsWhere<Users> = {
      [verifyCodeDTO.type.toLowerCase()]: verifyCodeDTO.vid,
    }
    const repository = this.getManager().getRepository(Users)
    const foundUser = await repository.findOne({
      where: {
        ...userWhereCond,
      },
    })

    if (!foundUser) {
      throw new NotFoundException()
    }

    // TODO: redisService를 통해 값 가져오는 매소드 구성
    const code = await this.redis.get(foundUser.id)
    if (!code) throw new NotFoundException()
    if (code !== verifyCodeDTO.code) throw new UnauthorizedException()

    const changePasswordKey = this.verificationsService.generateRandomString({
      onlyString: true,
      length: 16,
    })
    await Promise.all([
      this.redis.del(foundUser.id),
      this.redis.set(changePasswordKey, foundUser.id, 'EX', 60 * 60),
    ])
    return changePasswordKey
  }

  async refresh(refreshDTO: RefreshDTO) {
    const verifiedToken = this.verify(refreshDTO.refreshToken)

    const foundUser = await this.usersService.getUserById(verifiedToken.uid)
    if (foundUser.refreshToken !== refreshDTO.refreshToken)
      throw new UnauthorizedException()

    const newToken = await this.publishToken(foundUser.id)

    return newToken
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
