export interface JWTToken<T = unknown> {
  header: { kid: string; alg: string }
  payload: T | any
  signature: string
}
