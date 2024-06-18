import { IPoopError } from '@/shared/errors/error.interface'

export class ResultCode implements IPoopError {
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
