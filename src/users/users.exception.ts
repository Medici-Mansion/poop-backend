import { ApiException } from '@/shared/exceptions/exception.interface'
import { IPoopError } from '@/shared/errors/error.interface'

import { generateResponse } from '@/shared/utils'

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
export const UserCodes = {
  [UserCode.CONFLICT]: generateResponse(419, 1100, '이미 존재하는 유저'),
  [UserCode.NOTFOUND]: generateResponse(400, 1101, '존재하지 않는 유저'),
}

export class UserException extends ApiException {
  constructor(poopError: IPoopError) {
    super(poopError)
  }

  static get CONFLICT() {
    return new UserException(UserCodes['USER:CONFLICT']())
  }
  static get NOTFOUND() {
    return new UserException(UserCodes['USER:NOTFOUND']())
  }
}
