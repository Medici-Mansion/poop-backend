import axios from 'axios'
import { JwtService } from '@nestjs/jwt'

import { OauthProvider } from '@/shared/interfaces/oauth.interface'

import { JWTToken } from '@/auth/interface/apple.interface'
import { AppleToken } from '@/auth/dtos/apple-token.dto'
import { validateOrReject } from 'class-validator'
import { createPublicKey } from 'crypto'
import { Injectable } from '@nestjs/common'

@Injectable()
export class AppleProvider implements OauthProvider {
  constructor(private readonly jwtService: JwtService) {}
  validate(...args: any[]) {
    throw new Error('Method not implemented.')
  }
  async getUserByToken(token: string) {
    const { data } = await axios({
      url: 'https://appleid.apple.com/auth/keys',
      method: 'get',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const { header, payload } = this.jwtService.decode(token, {
      complete: true,
    }) as JWTToken<AppleToken>
    const decodedToken = new AppleToken(payload)
    await validateOrReject(decodedToken)

    const currentPubKeyFromApple = data.keys.find((key) => {
      if (key.alg === header.alg && key.kid === header.kid) {
        return key
      }
    })

    if (!currentPubKeyFromApple) {
      throw new Error()
    }

    const pubkey = createPublicKey({
      key: {
        n: currentPubKeyFromApple.n,
        e: currentPubKeyFromApple.e,
        kty: currentPubKeyFromApple.kty,
      },
      format: 'jwk',
    }) as any

    const body = this.jwtService.verify(token, {
      publicKey: pubkey,
      algorithms: ['RS256'],
    })

    return new AppleToken(body)
  }
}
