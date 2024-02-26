import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory() {
        console.log(process.env.CA_CERT)
        return {
          type: 'postgres',
          host: process.env.DB_HOST,
          port: +process.env.DB_PORT,
          username: process.env.DB_USER,
          password: process.env.DB_PWD,
          database: process.env.DB_NAME,
          synchronize: process.env.NODE_ENV !== 'production',
          schema: 'development',
          ssl: {
            // ca: readFileSync(join(process.cwd(), 'cert/ca-certificate.crt')),
            ca: process.env.CA_CERT,
          },
          logging: process.env.NODE_ENV !== 'production',
          entities: [__dirname + './../**/**.entity{.ts,.js}'],
        }
      },
    }),
  ],
})
export class DatabaseModule {}
