import { ApiProperty } from '@nestjs/swagger'
import { ErrorCodeIfs } from '@/shared/errors/error.interface'
import { Result } from '@/shared/dtos/result.dto'

export class Api<T = any> {
  @ApiProperty()
  private readonly result: Result

  @ApiProperty()
  private readonly body?: T | null

  constructor(result: Result, body?: T) {
    this.result = result
    this.body = body ?? null
  }

  static OK<T>(data: T): Api<T> {
    return new Api<T>(Result.OK(), data)
  }

  static ERROR(errorCodeIfs: ErrorCodeIfs): Api<null>
  static ERROR(result: Result | ErrorCodeIfs): Api<null>
  static ERROR(result: Result | ErrorCodeIfs, description?: string): Api<null> {
    if (result instanceof Result) {
      return new Api<null>(result, null)
    }
    return new Api<null>(Result.ERROR(result, description))
  }
}
