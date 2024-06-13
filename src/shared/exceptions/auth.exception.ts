import { ApiException } from '@/shared/exceptions/exception.interface'
import { ErrorCodeIfs } from '@/shared/errors/error.interface'

export class AuthException extends ApiException {
  constructor(errorCodeIfs: ErrorCodeIfs) {
    super(errorCodeIfs)
  }
}
