import { UseInterceptors, applyDecorators } from '@nestjs/common'
import { TransactionInterceptor } from '@/shared/interceptors/transaction.interceptor'

export function Transaction() {
  return applyDecorators(UseInterceptors(TransactionInterceptor))
}
