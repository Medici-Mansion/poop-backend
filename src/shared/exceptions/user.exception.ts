import { ApiException } from '@/shared/exceptions/exception.interface'
import { IErrorCode, IPoopError } from '@/shared/errors/error.interface'

import { ResultCode } from '@/shared/errors/dtos/resultCode.dto'

export enum UserCode {
  CONFLICT = 'USER:CONFLICT',
  NOTFOUND = 'USER:NOTFOUND',
}

/**
 * User 에러코드
 * 1100 ~ 1199
 * 1100 이미 존재하는 유저
 * 1101 존재하지 않는 유저
 */
export const UserCodes: IErrorCode<UserCode> = {
  [UserCode.CONFLICT]: new ResultCode(419, 1100, '이미 존재하는 유저'),
  [UserCode.NOTFOUND]: new ResultCode(400, 1101, '존재하지 않는 유저'),
}

export class UserException extends ApiException {
  constructor(poopError: IPoopError) {
    super(poopError)
  }

  static get CONFLICT() {
    return new UserException(UserCodes['USER:CONFLICT'])
  }
  static get NOTFOUND() {
    return new UserException(UserCodes['USER:NOTFOUND'])
  }
}
