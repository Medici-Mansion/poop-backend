import { HttpException } from '@nestjs/common'
import { IPoopError } from '../errors/error.interface'
import { CommonCodes } from '../errors/code/common.code'

export class ApiException extends HttpException {
  public readonly poopError: IPoopError
  protected constructor(poopError: IPoopError) {
    super(poopError.getDescription(), poopError.getErrorCode(), {})
    this.poopError = poopError
  }

  static get CONFLICT() {
    return new ApiException(CommonCodes.CONFLICT)
  }
}
