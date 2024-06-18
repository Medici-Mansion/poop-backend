import { IErrorCode } from '@/shared/errors/error.interface'
import { ResultCode } from '@/shared/errors/dtos/resultCode.dto'

export enum CommonCode {
  OK = 'OK',
  BAD_REQUEST = 'BAD_REQUEST',
  SERVER_ERROR = 'SERVER_ERROR',
}

export const CommonCodes: IErrorCode<CommonCode> = {
  OK: new ResultCode(200, 200, '성공'),
  BAD_REQUEST: new ResultCode(400, 400, '잘못된 요청'),
  SERVER_ERROR: new ResultCode(500, 500, '서버 에러'),
}
