import { ApiException } from '@/shared/exceptions/exception.interface'
import { IPoopError } from '@/shared/errors/error.interface'

export class AuthException extends ApiException {
  constructor(poopError: IPoopError) {
    super(poopError)
  }
}
