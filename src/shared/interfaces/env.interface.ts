export interface Env {
  readonly NODE_ENV: 'development' | 'production' | 'test'
  readonly JWT_SECRET: string
  readonly JWT_PUBLIC_KEY: string
  readonly JWT_PRIVATE_KEY: string
  readonly HASH_ROUNDS: string
  readonly DB_USER: string
  readonly DB_PWD: string
  readonly DB_HOST: string
  readonly DB_PORT: string
  readonly DB_NAME: string
  readonly DATABASE_URL: string
  readonly SSL_MODE: string
  readonly CA_CERT: string
  readonly ACCESS_EXPIRES_IN: string
  readonly COOKIE_SECRET: string
  readonly SALT: string
  readonly COOL_SMS_KEY: string
  readonly COOL_SMS_SECRET: string
  readonly MAILGUN_DOMAIN: string
  readonly MAILGUN_API_KEY: string
  readonly CLOUDINARY_API_KEY: string
  readonly CLOUDINARY_CLOUD_NAME: string
  readonly CLOUDINARY_API_SECRET: string
  readonly INFLUXDB_TOKEN: string
  readonly INFLUXDB_HOST: string
  readonly INFLUXDB_NAME: string
  readonly REDIS_HOST: string
  readonly REDIS_PORT: string
  readonly REDIS_PWD: string
  readonly AWS_S3_BUCKET_NAME: string
  readonly AWS_S3_REGION: string
  readonly AWS_S3_ACCESS_KEY: string
  readonly AWS_S3_ACCESS_SECRET_KEY: string
  readonly SEARCH_API_URL: string
}
