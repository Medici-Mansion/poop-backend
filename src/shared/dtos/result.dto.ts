import { ApiProperty } from '@nestjs/swagger'
import { ErrorCode, ErrorCodes } from '../errors/error.code'
import { ErrorCodeIfs } from '../errors/error.interface'

export class Result<T = unknown> {
  @ApiProperty()
  public resultCode: number
  @ApiProperty()
  public resultMessage: string
  @ApiProperty()
  public resultDescription: string
  @ApiProperty()
  public data?: T

  constructor(
    resultCode: number,
    resultMessage: string,
    resultDescription: string,
    data?: T,
  ) {
    this.resultCode = resultCode
    this.resultMessage = resultMessage
    this.resultDescription = resultDescription
    this.data = data
  }

  static OK(): Result {
    const errorCode = ErrorCodes[ErrorCode.OK]
    return new Result(
      errorCode.getErrorCode(),
      errorCode.getDescription(),
      '성공',
    )
  }

  static ERROR(errorCodeIfs: ErrorCodeIfs, message?: string | Error): Result {
    return new Result(
      errorCodeIfs.getErrorCode(),
      errorCodeIfs.getDescription(),
      (message instanceof Error ? message.message : message) || '에러발생',
    )
  }
}
