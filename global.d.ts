declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test'
    readonly JWT_SECRET: string
    readonly HASH_ROUNDS: string
    readonly DB_USER: string
    readonly DB_PWD: string
    readonly DB_HOST: string
    readonly DB_PORT: string
    readonly DB_NAME: string
    readonly SSL_MODE: string
    readonly CA_CERT: string
  }
}
