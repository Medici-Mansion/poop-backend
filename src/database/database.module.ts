import { Global, Module } from '@nestjs/common'
import {
  ConfigurableDatabaseModule,
  DATABASE_OPTIONS,
} from './database.module-definition'

import { Pool } from 'pg'
import { ParseJSONResultsPlugin, PostgresDialect } from 'kysely'

import { DatabaseOptions } from './database.option'
import { Database } from './database.class'

@Global()
@Module({
  exports: [Database],
  providers: [
    {
      provide: Database,
      inject: [DATABASE_OPTIONS],
      useFactory: (databaseOptions: DatabaseOptions) => {
        const dialect = new PostgresDialect({
          pool: new Pool({
            host: databaseOptions.host,
            port: databaseOptions.port,
            user: databaseOptions.user,
            password: databaseOptions.password,
            database: databaseOptions.database,
          }),
        })

        return new Database({
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
      },
    },
  ],
})
export class DatabaseModule extends ConfigurableDatabaseModule {}
