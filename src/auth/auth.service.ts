import bcrypt from 'bcrypt'
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { validateOrReject } from 'class-validator'
import { Transactional } from '@nestjs-cls/transactional'

import { UsersService } from '@/users/users.service'
import { VerificationsService } from '@/verifications/verifications.service'
import { ExternalsService } from '@/externals/externals.service'
import { RedisService } from '@/redis/redis.service'

import { CreateUserDTO } from '@/users/dtos/create-user.dto'
import {
  VerificationType,
  VerifyingCodeResponseDTO,
  VerifyCodeDTO,
} from '@/verifications/dtos/verify-code.dto'
import { LoginRequestDTO } from '@/auth/dtos/login.dto'
import { GetUserByVidDTO } from '@/users/dtos/get-user-by-vid.dto'

import { TokenPayload } from '@/shared/interfaces/token.interface'
import { AuthRepository } from '@/auth/auth.repository'

import { UserException } from '@/users/users.exception'
import { ChangePasswordCodeResponseDTO } from './dtos/change-password-code-response.dto'
import { AuthException } from './auth.exception'

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly verificationsService: VerificationsService,
    private readonly externalsService: ExternalsService,
    private readonly redisService: RedisService,
  ) {}

  @Transactional()
  async signup(createUserDTO: CreateUserDTO): Promise<boolean> {
    const existUser = await this.authRepository.findOne(createUserDTO)
    if (existUser) {
      throw UserException.CONFLICT
    }
    const hashedPassword = await this.usersService.hashPassword(
      createUserDTO.password,
    )

    const newUser = await this.authRepository.create({
      ...createUserDTO,
      password: hashedPassword,
    })

    const newVerification = await this.verificationsService.create({
      userId: newUser.id,
      code: this.verificationsService.generateRandomString({
        onlyString: false,
        length: 6,
      }),
      updatedAt: new Date(),
    })

    await this.externalsService.sendSMS(
      `[풉 POOP] 인증번호 확인 문자입니다. \n 인증코드: ${newVerification.code}`,
      newUser.phone,
    )

    return true
  }

  @Transactional()
  async requestVerificationCode(
    getUserByVidDTO: GetUserByVidDTO,
  ): Promise<boolean> {
    /**
     * 가입요청을 한 적이 있는지 확인
     */
    const foundVerification =
      await this.verificationsService.getVerificationByVid(getUserByVidDTO)

    const newVerification =
      await this.verificationsService.refreshVerificationCode(
        foundVerification.id,
      )
    if (getUserByVidDTO.type === VerificationType.PHONE) {
      await this.externalsService.sendSMS(
        `[풉 POOP] 인증번호 확인 문자입니다. \n 인증코드: ${newVerification.code}`,
        getUserByVidDTO.vid,
      )
      return true
    }
    throw AuthException.NOTFOUND
  }

  @Transactional()
  async verifyingCode(verifyCodeDTO: VerifyCodeDTO): Promise<boolean> {
    await this.verificationsService.verifyingCode(verifyCodeDTO)
    const foundVerification =
      await this.verificationsService.getVerificationByVid(verifyCodeDTO)

    await this.usersService.update(foundVerification.userId, {
      verified: new Date(),
    })

    await this.verificationsService.removeVerification(foundVerification.id)
    return true
  }

  async login(
    loginRequestDTO: LoginRequestDTO,
  ): Promise<VerifyingCodeResponseDTO> {
    const userWhereCond = {
      // email: loginRequestDTO.id,
      phone: loginRequestDTO.id,
      nickname: loginRequestDTO.id,
    }

    const foundUser = await this.authRepository.findOne(userWhereCond)

    if (!foundUser) throw UserException.NOTFOUND
    if (!foundUser.verified) throw new ForbiddenException('미인증 계정')
    const validPassword = await this.checkPassword(
      loginRequestDTO.password,
      foundUser.password,
    )

    if (!validPassword) throw new BadRequestException('비밀번호가 다릅니다.')

    // TODO: 커스텀에러를 통해 인증되지 않은 계정의 로그인 요청 분기 필요합니다.
    const newVerifyToken = await this.publishToken(foundUser.id)

    return newVerifyToken
  }

  /**
   * TODO: 리펙토링 필요
   * 이미 인증된 경우 or 인증되지 않은 경우 모두 사용 가능 해야 함
   * @param getUserByVidDTO
   * @returns
   */
  async getChangePasswordCode(
    getUserByVidDTO: GetUserByVidDTO,
  ): Promise<boolean> {
    const foundUser = await this.usersService.getUserByVid(getUserByVidDTO)
    const code = this.verificationsService.generateRandomString()
    if (getUserByVidDTO.type === VerificationType.PHONE) {
      await this.externalsService.sendSMS(
        `POOP! \n 인증코드: ${code}`,
        getUserByVidDTO.vid,
      )
      await this.redisService.setPasswordCode(foundUser.id, code)
      return true
    }
    // else if (getUserByVidDTO.type === VerificationType.EMAIL) {
    //   await this.externalsService.sendEmail(
    //     '[PooP!] 계정인증코드입니다.',
    //     getUserByVidDTO.vid,
    //     EmailTemplateName.CONFIRM_EMAIL,
    //     [
    //       {
    //         key: 'code',
    //         value: code,
    //       },
    //     ],
    //   )
    // }

    throw AuthException.NOTFOUND
  }

  async verifyChangePasswordCode(
    verifyCodeDTO: VerifyCodeDTO,
  ): Promise<ChangePasswordCodeResponseDTO> {
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

    return new ChangePasswordCodeResponseDTO(changePasswordKey)
  }

  async refresh(token: string): Promise<VerifyingCodeResponseDTO> {
    const verifiedToken = this.verify(token, {
      ignoreExpiration: true,
    })

    const foundUser = await this.usersService.getUserById(verifiedToken.uid)

    // 존재하지 않는 회원이거나, 로그인한 이력이 없는 회원일 경우
    if (!foundUser || !foundUser.latestToken) throw new UnauthorizedException()

    // 마지막 사용된 토큰과 다른 토큰이 전달 된 경우
    if (foundUser.latestToken !== token) throw new UnauthorizedException()

    const newToken = await this.publishToken(foundUser.id)

    return newToken
  }

  verify(
    token: string,
    verifyingOptions: { ignoreExpiration?: boolean } = {},
  ): TokenPayload {
    try {
      return this.jwtService.verify<TokenPayload>(token, {
        ignoreExpiration: !!verifyingOptions.ignoreExpiration,
        algorithms: ['RS256'],
      })
    } catch (e) {
      throw new UnauthorizedException()
    }
  }

  async sign(uid: string): Promise<string> {
    try {
      const newTokenPayload = new TokenPayload()
      newTokenPayload.uid = uid

      await validateOrReject(newTokenPayload)
      return this.jwtService.sign(
        { uid },
        {
          algorithm: 'RS256',
        },
      )
    } catch (error) {
      throw new ForbiddenException()
    }
  }

  private async publishToken(id: string): Promise<VerifyingCodeResponseDTO> {
    const token = {
      accessToken: await this.sign(id),
    }

    await this.usersService.update(id, { latestToken: token.accessToken })

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
