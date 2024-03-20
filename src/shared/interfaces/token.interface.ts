import { IsUUID } from 'class-validator'

export type TokenType = 'ACCESS' | 'REFRESH'

export interface AuthTokenResponse {
  accessToken: string
  refreshToken: string
}

export class TokenPayload {
  @IsUUID()
  uid: string
}
