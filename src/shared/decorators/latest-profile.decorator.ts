import {
  ExecutionContext,
  UseGuards,
  applyDecorators,
  createParamDecorator,
} from '@nestjs/common'
import { AccessGuard } from '@/auth/guards/access.guard'
import { LoginProfileGuard } from '@/auth/guards/login-profile.guard'
import { ProfileDTO } from '@/profiles/dtos/get-profile.dto'

export function LatestProfile() {
  return applyDecorators(UseGuards(AccessGuard, LoginProfileGuard))
}

export const ExtractLatestProfile = createParamDecorator(
  (_: unknown, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest()
    if (req['profile']) {
      const profile = new ProfileDTO({
        ...req['profile'],
        isLatestLoginProfile: true,
      })
      return profile
    }
    return req['profile']
  },
)
