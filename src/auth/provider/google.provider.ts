import { ConfigService } from '@nestjs/config'
import { OauthProvider } from '@/shared/interfaces/oauth.interface'
import { OAuth2Client } from 'google-auth-library'
import { Env } from '@/shared/interfaces/env.interface'

export class GoogleProvider implements OauthProvider {
  constructor(
    private readonly OAuth2Client: OAuth2Client,
    private readonly configService: ConfigService<Env>,
  ) {}

  validate(...args: any[]) {
    throw new Error('Method not implemented.')
  }

  async getUserByToken(token: string) {
    const client = this.OAuth2Client
    const loginTicket = await client.verifyIdToken({
      idToken: token,
      audience: this.configService.get('GOOGLE_CLIENT_ID'),
    })
    const tokenPayload = loginTicket.getPayload()
    return tokenPayload
  }
}
