import { HttpException } from '@nestjs/common'
import { IPoopError } from '../errors/error.interface'

export class ApiException extends HttpException {
  public readonly poopError: IPoopError
  constructor(poopError: IPoopError) {
    super(poopError.getDescription(), poopError.getErrorCode(), {})
    this.poopError = poopError
  }
}
