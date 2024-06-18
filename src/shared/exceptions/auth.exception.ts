import { ApiException } from '@/shared/exceptions/exception.interface'
import { IPoopError } from '@/shared/errors/error.interface'
import { IErrorCode } from '@/shared/errors/error.interface'
import { ResultCode } from '@/shared/errors/dtos/resultCode.dto'

export enum AuthCode {
  UNAUTHROIZED = 'AUTH:UNAUTHROIZED',
}

/**
 * Auth 에러코드
 * 1000 ~ 1099
 * 1000 미인가 접근
 *
 *
 */
export const AuthCodes: IErrorCode<AuthCode> = {
  [AuthCode.UNAUTHROIZED]: new ResultCode(401, 1000, '접근할 수 없습니다.'),
}

export class AuthException extends ApiException {
  constructor(poopError: IPoopError) {
    super(poopError)
  }

  static get UNAUTHROIZED() {
    return new AuthException(AuthCodes['AUTH:UNAUTHROIZED'])
  }
}
