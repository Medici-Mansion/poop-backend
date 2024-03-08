import {
  ExecutionContext,
  UnauthorizedException,
  createParamDecorator,
} from '@nestjs/common'

export const UserId = createParamDecorator(
  (_: unknown, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest()
    if (!req['token']) throw new UnauthorizedException()
    return req['token']
  },
)
