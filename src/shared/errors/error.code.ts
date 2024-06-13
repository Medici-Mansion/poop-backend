import { ErrorCodeIfs } from '@/shared/errors/error.interface'

export enum ErrorCode {
  OK = 'OK',
  BAD_REQUEST = 'BAD_REQUEST',
  SERVER_ERROR = 'SERVER_ERROR',
}

export class ErrorCodeDetails implements ErrorCodeIfs {
  constructor(
    private httpStatusCode: number,
    private errorCode: number,
    private description: string,
  ) {}

  getHttpStatusCode(): number {
    return this.httpStatusCode
  }

  getErrorCode(): number {
    return this.errorCode
  }

  getDescription(): string {
    return this.description
  }
}

export const ErrorCodes: { [key in ErrorCode]: ErrorCodeIfs } = {
  [ErrorCode.OK]: new ErrorCodeDetails(200, 200, '성공'),
  [ErrorCode.BAD_REQUEST]: new ErrorCodeDetails(400, 400, '잘못된 요청'),
  [ErrorCode.SERVER_ERROR]: new ErrorCodeDetails(500, 500, '서버 에러'),
}
