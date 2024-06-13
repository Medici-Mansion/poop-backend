import { HttpException } from '@nestjs/common'
import { ErrorCodeIfs } from '../errors/error.interface'

export class ApiException extends HttpException {
  public readonly errorCodeIfs: ErrorCodeIfs
  constructor(errorCodeIfs: ErrorCodeIfs) {
    super(errorCodeIfs.getDescription(), errorCodeIfs.getErrorCode(), {})
    this.errorCodeIfs = errorCodeIfs
  }
}
