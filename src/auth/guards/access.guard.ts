import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { Reflector } from '@nestjs/core'
import { FastifyRequest } from 'fastify'

import { AuthService } from '@/auth/auth.service'

import { TOKEN_KEY } from '@/shared/constants/common.constant'

@Injectable()
export class AccessGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.get('isPublic', context.getHandler())

    if (isPublic) return true
    const request = context.switchToHttp().getRequest() as FastifyRequest

    const token = request.headers[TOKEN_KEY] as string
    if (!token) {
      throw new UnauthorizedException()
    }
    const payload = this.authService.verify(token)

    request['token'] = payload
    return true
  }
}
