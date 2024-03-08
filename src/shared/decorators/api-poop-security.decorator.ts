import { applyDecorators } from '@nestjs/common'
import { ApiSecurity } from '@nestjs/swagger'
import { TOKEN_KEY } from '@/shared/constants/common.constants'

export function ApiPoopSecurity() {
  return applyDecorators(ApiSecurity(TOKEN_KEY))
}
