import bcrypt from 'bcrypt'
import { Transactional } from '@nestjs-cls/transactional'
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { validateOrReject } from 'class-validator'

import { UsersService } from '@/users/users.service'
import { VerificationsService } from '@/verifications/verifications.service'
import { ExternalsService } from '@/externals/externals.service'
import { RedisService } from '@/redis/redis.service'
import { BaseService } from '@/shared/services/base.service'
import { DataSourceService } from '@/prisma/datasource.service'

import { CreateUserDTO } from '@/users/dtos/create-user.dto'
import {
  VerificationType,
  VerifyingCodeResponseDTO,
  VerifyCodeDTO,
} from '@/verifications/dtos/verify-code.dto'
import { LoginRequestDTO } from '@/auth/dtos/login.dto'
import { GetUserByVidDTO } from '@/users/dtos/get-user-by-vid.dto'
import { RefreshDTO } from '@/auth/dtos/refresh.dto'

import { EmailTemplateName } from '@/shared/constants/common.constant'

import { TokenPayload, TokenType } from '@/shared/interfaces/token.interface'

@Injectable()
export class AuthService {
  constructor(
    private readonly baseService: BaseService,
    private readonly dataSourceService: DataSourceService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly verificationsService: VerificationsService,
    private readonly externalsService: ExternalsService,
    private readonly redisService: RedisService,
  ) {}

  @Transactional()
  async signup(createUserDTO: CreateUserDTO): Promise<boolean> {
    this.dataSourceService
    const existUser = await this.dataSourceService.manager.user.findFirst({
      where: {
        OR: [
          {
            accountId: createUserDTO.id,
          },
          {
            nickname: createUserDTO.nickname,
          },
          {
            phone: createUserDTO.phone,
          },
          {
            email: createUserDTO.email,
          },
        ],
      },
    })
    if (existUser) {
      throw new ConflictException()
    }
    const { id, ...newUserData } = createUserDTO
    const hashedPassword = await this.usersService.hashPassword(
      newUserData.password,
    )
    const newUser = await this.dataSourceService.manager.user.create({
      data: {
        accountId: id,
        ...newUserData,
        password: hashedPassword,
        birthday: new Date(newUserData.birthday),
      },
    })

    await this.dataSourceService.manager.verification.create({
      data: {
        user: {
          connect: {
            id: newUser.id,
          },
        },
        code: this.verificationsService.generateRandomString({
          onlyString: false,
          length: 6,
        }),
      },
    })
    return true
  }

  @Transactional()
  async requestVerificationCode(getUserByVidDTO: GetUserByVidDTO) {
    const foundVerification =
      await this.verificationsService.getVerificationByVid(getUserByVidDTO)

    const newVerification =
      await this.verificationsService.refreshVerificationCode(
        foundVerification.id,
      )
    if (getUserByVidDTO.type === VerificationType.PHONE) {
      await this.externalsService.sendSMS(
        `POOP! \n 인증코드: ${newVerification.code}`,
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
            value: newVerification.code,
          },
        ],
      )
    }

    return true
  }

  @Transactional()
  async verifyingCode(verifyCodeDTO: VerifyCodeDTO): Promise<boolean> {
    await this.verificationsService.verifyingCode(verifyCodeDTO)
    const foundVerification =
      await this.verificationsService.getVerificationByVid(verifyCodeDTO)

    await this.dataSourceService.manager.user.update({
      where: {
        id: foundVerification.userId,
      },
      data: {
        verified: new Date(),
      },
    })

    await this.verificationsService.removeVerification(foundVerification.id)
    return true
  }

  async login(
    loginRequestDTO: LoginRequestDTO,
  ): Promise<VerifyingCodeResponseDTO> {
    const userWhereCond = {
      OR: [
        {
          email: loginRequestDTO.id,
        },
        {
          phone: loginRequestDTO.id,
        },
        {
          nickname: loginRequestDTO.id,
        },
      ],
    }

    const foundUser = await this.dataSourceService.manager.user.findFirst({
      where: userWhereCond,
    })
    if (!foundUser) throw new NotFoundException()
    if (!foundUser.verified) throw new ForbiddenException('미인증 계정')
    const validPassword = await this.checkPassword(
      loginRequestDTO.password,
      foundUser.password,
    )
    if (!validPassword) throw new BadRequestException('비밀번호가 다릅니다.')

    // TODO: 커스텀에러를 통해 인증되지 않은 계정의 로그인 요청 분기 필요합니다.

    return this.publishToken(foundUser.id)
  }

  /**
   * TODO: 리펙토링 필요
   * 이미 인증된 경우 or 인증되지 않은 경우 모두 사용 가능 해야 함
   * @param getUserByVidDTO
   * @returns
   */
  async getChangePasswordCode(getUserByVidDTO: GetUserByVidDTO) {
    const foundUser = await this.usersService.getUserByVid(getUserByVidDTO)
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
    await this.redisService.setPasswordCode(foundUser.id, code)
    return true
  }

  async verifyChangePasswordCode(
    verifyCodeDTO: VerifyCodeDTO,
  ): Promise<string> {
    const foundUser = await this.usersService.getUserByVid(verifyCodeDTO)

    const code = await this.redisService.findById(foundUser.id)
    if (!code) throw new NotFoundException()
    if (code !== verifyCodeDTO.code) throw new UnauthorizedException()

    const changePasswordKey = this.verificationsService.generateRandomString({
      onlyString: true,
      length: 16,
    })
    await this.redisService.setChangePasswordCode(
      foundUser.id,
      changePasswordKey,
    )

    return changePasswordKey
  }

  async refresh(refreshDTO: RefreshDTO) {
    const verifiedToken = this.verify(refreshDTO.refreshToken)

    const foundUser = await this.usersService.getUserById(verifiedToken.uid)
    if (
      !foundUser.refreshToken ||
      foundUser.refreshToken !== refreshDTO.refreshToken
    )
      throw new UnauthorizedException()

    const newToken = await this.publishToken(foundUser.id)

    return newToken
  }

  verify(token: string): TokenPayload {
    try {
      return this.jwtService.verify<TokenPayload>(token, {
        secret: this.baseService.conf.get('JWT_SECRET'),
      })
    } catch (e) {
      throw new UnauthorizedException()
    }
  }

  async sign(uid: string, tokenType: TokenType = 'ACCESS'): Promise<string> {
    try {
      const newTokenPayload = new TokenPayload()
      newTokenPayload.uid = uid

      await validateOrReject(newTokenPayload)

      return this.jwtService.sign(
        { uid },
        {
          expiresIn:
            tokenType === 'ACCESS'
              ? this.baseService.conf.get('ACCESS_EXPIRES_IN')
              : this.baseService.conf.get('REFRESH_EXPIRES_IN'),
          secret: this.baseService.conf.get('JWT_SECRET'),
        },
      )
    } catch (error) {
      throw new ForbiddenException()
    }
  }

  private async publishToken(id: string): Promise<VerifyingCodeResponseDTO> {
    const token = {
      accessToken: await this.sign(id),
      refreshToken: await this.sign(id, 'REFRESH'),
    }

    await this.dataSourceService.manager.user.update({
      where: { id },
      data: { refreshToken: token.refreshToken },
    })

    return new VerifyingCodeResponseDTO(token)
  }

  async checkPassword(aPassword: string, bPassword): Promise<boolean> {
    try {
      return bcrypt.compare(aPassword, bPassword)
    } catch (e) {
      throw new InternalServerErrorException()
    }
  }
}
