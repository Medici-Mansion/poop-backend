import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { Users } from '@/users/entites/users.entity'
import { UsersService } from '@/users/users.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  extractTokenFromHeader(header: string, isBearer: boolean) {
    const splitToken = header.split(' ')
    const prefix = isBearer ? 'Bearer' : 'Basic'
    if (splitToken.length !== 2 || splitToken[0] !== prefix) {
      console.log(splitToken.length, splitToken[0], '123')
      throw new UnauthorizedException('잘못된 토큰입니다!')
    }

    return splitToken[1]
  }

  signToken(user: Pick<Users, 'email' | 'id'>, isRefreshToken: boolean) {
    const payload = {
      email: user,
      sub: user.id,
      type: isRefreshToken ? 'refresh' : 'access',
    }

    return this.jwtService.sign(payload, {
      expiresIn: isRefreshToken ? 3600 : 300,
    })
  }

  loginUser(user: Pick<Users, 'email' | 'id'>) {
    return {
      accessToken: this.signToken(user, false),
      refreshToken: this.signToken(user, true),
    }
  }

  async authenticateWithEmailAndPassword(
    user: Pick<Users, 'email' | 'password'>,
  ) {
    const existingUser = await this.usersService.getUserByEmail(user.email)

    if (!existingUser) {
      throw new UnauthorizedException('존재하지 않는 사용자입니다.')
    }

    const pass = await bcrypt.compare(user.password, existingUser.password)

    if (!pass) {
      throw new UnauthorizedException('비밀번호가 틀렸습니다.')
    }

    return existingUser
  }

  async loginWithEmail(user: Pick<Users, 'email' | 'password'>) {
    const existingUser = await this.authenticateWithEmailAndPassword(user)

    return this.loginUser(existingUser)
  }

  async registerWithEmail(
    user: Pick<Users, 'nickname' | 'email' | 'password'>,
  ) {
    const hash = await bcrypt.hash(user.password, +process.env.HASH_ROUNDS)

    const newUser = await this.usersService.createUser({
      ...user,
      password: hash,
    })

    return this.loginUser(newUser)
  }

  decodeBasicToken(base64String: string) {
    const decoded = Buffer.from(base64String, 'base64').toString('utf-8')

    const split = decoded.split(':')

    if (split.length !== 2) {
      throw new UnauthorizedException('잘못된 유형의 토큰입니다.')
    }

    return {
      email: split[0],
      password: split[1],
    }
  }

  verifyToken(token: string) {
    try {
      return this.jwtService.verify(token)
    } catch (e) {
      throw new UnauthorizedException('토큰이 만료됐거나 잘못된 토큰입니다.')
    }
  }

  roateToken(token: string, isRefreshToken: boolean) {
    const decoded = this.jwtService.verify(token)

    if (decoded.type !== 'refresh') {
      throw new UnauthorizedException(
        '토큰 재발급은 refrechToken으로만 가능합니다.',
      )
    }

    return this.signToken(
      {
        ...decoded,
      },
      isRefreshToken,
    )
  }
}
