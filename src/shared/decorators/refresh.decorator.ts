import {
  ExecutionContext,
  SetMetadata,
  UnauthorizedException,
  createParamDecorator,
} from '@nestjs/common'

export const Refresh = () => SetMetadata('isRefresh', true)
export const PlainToken = createParamDecorator(
  (_: unknown, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest()
    if (!req['plainToken']) throw new UnauthorizedException()
    return req['plainToken']
  },
)
