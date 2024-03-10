import {
  ExecutionContext,
  UseGuards,
  applyDecorators,
  createParamDecorator,
} from '@nestjs/common'
import { AccessGuard } from '@/auth/guards/access.guard'
import { LoginProfileGuard } from '@/auth/guards/login-profile.guard'

export function LatestProfile() {
  return applyDecorators(UseGuards(AccessGuard, LoginProfileGuard))
}

export const ExtractLatestProfile = createParamDecorator(
  (_: unknown, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest()
    return req['profile']
  },
)
