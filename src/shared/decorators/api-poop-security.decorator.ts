import { applyDecorators } from '@nestjs/common'
import { ApiSecurity } from '@nestjs/swagger'
import { TOKEN_KEY } from '@poop/common'

export function ApiPoopSecurity() {
  return applyDecorators(ApiSecurity(TOKEN_KEY))
}
