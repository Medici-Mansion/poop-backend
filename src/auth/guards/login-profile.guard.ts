import { UsersService } from '@/users/users.service'
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'

import { FastifyRequest } from 'fastify'
import { TokenPayload } from '@/shared/interfaces/token.interface'

@Injectable()
export class LoginProfileGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest() as FastifyRequest
    const token = req['token'] as TokenPayload
    if (!token) return false
    const user = await this.usersService.getUserById(token.uid)
    if (user.latestJoinProfile) {
      req['profile'] = user
    }
    return !!user.latestJoinProfile
  }
}
