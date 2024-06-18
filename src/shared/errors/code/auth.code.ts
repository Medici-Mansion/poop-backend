import { IErrorCode } from '@/shared/errors/error.interface'
import { ResultCode } from '@/shared/errors/dtos/resultCode.dto'

export enum AuthCode {
  CONFLICT_USER = 'CONFLICT_ USER',
}

/**
 * Auth 에러코드
 * 1000 ~ 1999
 * 1001 이미 존재하는 계정
 *
 *
 */
export const AuthCodes: IErrorCode<AuthCode> = {
  [AuthCode.CONFLICT_USER]: new ResultCode(419, 1001, '이미 존재하는 유저'),
}
