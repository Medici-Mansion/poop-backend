import { ApiProperty } from '@nestjs/swagger'
import { CommonCodes } from '@/shared/errors/code/common.code'
import { IPoopError } from '@/shared/errors/error.interface'

export class Result {
  @ApiProperty({ example: 200 })
  resultCode: number
  @ApiProperty({ example: '설명' })
  resultMessage: string

  constructor(resultCode: number, resultMessage: string) {
    this.resultCode = resultCode
    this.resultMessage = resultMessage
  }

  static OK(): Result {
    const errorCode = CommonCodes.OK()
    return new Result(errorCode.getErrorCode(), errorCode.getDescription())
  }

  static ERROR(poopError: IPoopError): Result {
    return new Result(poopError.getErrorCode(), poopError.getDescription())
  }
}
