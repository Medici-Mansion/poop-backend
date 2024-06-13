import { Global, Module } from '@nestjs/common'
import { Pool } from 'pg'
import { ConfigService } from '@nestjs/config'
import { ParseJSONResultsPlugin, PostgresDialect } from 'kysely'

import { ConfigurableDatabaseModule } from '@/database/database.module-definition'

import { Database } from '@/database/database.class'

import { Env } from '@/shared/interfaces/env.interface'

@Global()
@Module({
  exports: [Database],
  providers: [
    {
      provide: Database,
      inject: [ConfigService],
      useFactory: (configService: ConfigService<Env>) => {
        const dialect = new PostgresDialect({
          pool: new Pool({
            host: configService.get('DB_HOST'),
            port: configService.get('DB_PORT'),
            user: configService.get('DB_USER'),
            password: configService.get('DB_PWD'),
            database: configService.get('DB_NAME'),
            ssl: {
              rejectUnauthorized: false,
            },
          }),
        })

        const db = new Database({
          dialect,
          log: (event) => {
            console.log(`
- ${event.level}
[SQL]
${event.query.sql}

[Parameters]
[${event.query.parameters.join(', ')}]
            `)
          },
          plugins: [new ParseJSONResultsPlugin()],
        })

        return db
      },
    },
  ],
})
export class DatabaseModule extends ConfigurableDatabaseModule {}
