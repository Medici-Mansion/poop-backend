import { IsBoolean, IsNumber, IsString } from 'class-validator'

export class AppleToken {
  @IsString()
  iss: string
  @IsString()
  aud: string
  @IsNumber()
  exp: number
  @IsNumber()
  iat: number
  @IsString()
  sub: string
  @IsString()
  nonce: string
  @IsString()
  c_hash: string
  @IsString()
  email: string

  @IsBoolean()
  email_verified: boolean

  @IsBoolean()
  is_private_email: boolean

  @IsNumber()
  auth_time: number
  @IsBoolean()
  nonce_supported: boolean

  constructor(token: AppleToken) {
    this.iss = token.iss
    this.aud = token.aud
    this.exp = token.exp
    this.iat = token.iat
    this.sub = token.sub
    this.nonce = token.nonce
    this.c_hash = token.c_hash
    this.email = token.email
    this.email_verified = token.email_verified
    this.is_private_email = token.is_private_email
    this.auth_time = token.auth_time
    this.nonce_supported = token.nonce_supported
  }
}
