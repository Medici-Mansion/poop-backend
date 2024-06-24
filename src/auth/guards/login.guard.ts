import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { FastifyRequest } from 'fastify'

import { UsersService } from '@/users/users.service'

import { TokenPayload } from '@/shared/interfaces/token.interface'

@Injectable()
export class LoginGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest() as FastifyRequest
    const token = req['token'] as TokenPayload
    if (!token) return false
    const user = await this.usersService.getUserById(token.uid)
    req['user'] = user
    if (user.latestProfile) {
      req['profile'] = user.latestProfile
    }
    return !!user
  }
}
