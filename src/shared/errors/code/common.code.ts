import { IErrorCode } from '@/shared/errors/error.interface'
import { ResultCode } from '@/shared/errors/dtos/resultCode.dto'

export enum CommonCode {
  OK = 'OK',
  CREATED = 'CREATED',
  BAD_REQUEST = 'BAD_REQUEST',
  SERVER_ERROR = 'SERVER_ERROR',
  CONFLICT = 'CONFLICT',
}

export const CommonCodes: IErrorCode<CommonCode> = {
  OK: new ResultCode(200, 200, '성공'),
  CREATED: new ResultCode(201, 201, '생성완료'),
  BAD_REQUEST: new ResultCode(400, 400, '잘못된 요청'),
  CONFLICT: new ResultCode(419, 419, '중복'),
  SERVER_ERROR: new ResultCode(500, 500, '서버 에러'),
}
