import { ApiProperty } from '@nestjs/swagger'
import { IPoopError } from '@/shared/errors/error.interface'
import { Result } from '@/shared/dtos/result.dto'
import { Expose } from 'class-transformer'

export class Api<T = any> {
  @ApiProperty()
  result: Result

  @ApiProperty()
  @Expose()
  body?: T | null

  constructor(result: Result, body?: T) {
    this.result = result
    this.body = body ?? null
  }

  static OK<T>(data: T): Api<T> {
    return new Api<T>(Result.OK(), data)
  }

  static ERROR(poopError: IPoopError): Api<null> {
    return new Api<null>(Result.ERROR(poopError))
  }

  toScheme() {
    return class {
      constructor(
        public readonly result: Result,
        public readonly body: T,
      ) {}
    }
  }
}
