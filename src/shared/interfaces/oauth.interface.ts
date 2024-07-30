export abstract class OauthProvider {
  abstract validate(...args: any[]): any
  abstract getUserByToken(token: string): unknown
}
