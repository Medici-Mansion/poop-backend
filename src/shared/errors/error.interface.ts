export interface IPoopError {
  getHttpStatusCode(): number
  getErrorCode(): number
  getDescription(): string
}

export type TPoopError = (() => IPoopError) | IPoopError

export type IErrorCode<ErrorCode extends string | number | symbol = any> = {
  [key in ErrorCode]: TPoopError
}
