import { CommonCodes } from '@/shared/errors/code/common.code'
import { HttpException } from '@nestjs/common'
import { IPoopError } from '../errors/error.interface'

export class ApiException extends HttpException {
  public readonly poopError: IPoopError
  protected constructor(poopError: IPoopError) {
    super(poopError.getDescription(), poopError.getErrorCode(), {})
    this.poopError = poopError
  }

  static get CONFLICT() {
    return new ApiException(CommonCodes.CONFLICT())
  }

  static BAD_REQUEST(message?: string) {
    return new ApiException(
      CommonCodes.BAD_REQUEST({
        message,
      }),
    )
  }
}
