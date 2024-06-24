import {
  ExecutionContext,
  UseGuards,
  applyDecorators,
  createParamDecorator,
} from '@nestjs/common'
import { AccessGuard } from '@/auth/guards/access.guard'
import { ProfileDTO } from '@/profiles/dtos/get-profile.dto'
import { LoginGuard } from '@/auth/guards/login.guard'

export function LatestProfile() {
  return applyDecorators(UseGuards(AccessGuard, LoginGuard))
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
