import { ApiException } from '@/shared/exceptions/exception.interface'
import { IPoopError } from '@/shared/errors/error.interface'
import { generateResponse } from '@/shared/utils'

export enum AuthCode {
  UNAUTHROIZED = 'AUTH:UNAUTHROIZED',
  NOTFOUND = 'AUTH:NOUTFOUND',
}

/**
 * Auth 에러코드
 * 1000 ~ 1099
 * 1000 미인가 접근
 *
 *
 */
export const AuthCodes = {
  [AuthCode.UNAUTHROIZED]: generateResponse(401, 1000, '접근할 수 없습니다.'),
  [AuthCode.NOTFOUND]: generateResponse(404, 1004, '인증을 찾을 수 없어요.'),
}

export class AuthException extends ApiException {
  constructor(poopError: IPoopError) {
    super(poopError)
  }

  static get UNAUTHROIZED() {
    return new AuthException(AuthCodes['AUTH:UNAUTHROIZED']())
  }

  static get NOTFOUND() {
    return new AuthException(AuthCodes['AUTH:NOUTFOUND']())
  }
}
