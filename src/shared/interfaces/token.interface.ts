export type TokenType = 'ACCESS' | 'REFRESH'

export interface AuthTokenResponse {
  accessToken: string
  refreshToken: string
}

export interface TokenPayload {
  sid: string
}
