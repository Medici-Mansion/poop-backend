import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'
import { Reflector } from '@nestjs/core'
import { FastifyRequest } from 'fastify'

import { AuthService } from '@/auth/auth.service'

import { TOKEN_KEY } from '@/shared/constants/common.constant'
import { AuthException } from '@/shared/exceptions/auth.exception'

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
    const isRefreshRequest = this.reflector.get(
      'isRefresh',
      context.getHandler(),
    )

    if (isPublic) return true
    const request = context.switchToHttp().getRequest() as FastifyRequest

    const token = request.headers[TOKEN_KEY] as string
    if (!token) {
      throw AuthException.UNAUTHROIZED
    }
    const payload = this.authService.verify(token, {
      ignoreExpiration: !!isRefreshRequest,
    })
    if (isRefreshRequest) {
      request['plainToken'] = token
    }

    request['token'] = payload
    return true
  }
}
