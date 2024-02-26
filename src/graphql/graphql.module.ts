import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { DynamicModule, Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { join } from 'path'

export interface GraphQLModuleOptions extends ApolloDriverConfig {}

@Module({})
export class GraphqlModule {
  static register(options?: GraphQLModuleOptions): DynamicModule {
    return {
      module: GraphqlModule,
      imports: [
        GraphQLModule.forRoot<ApolloDriverConfig>({
          driver: ApolloDriver,
          definitions: {
            path: join(process.cwd(), 'src/graphql/schema.ts'),
            outputAs: 'class',
          },
          introspection: true,
          playground: true,
          installSubscriptionHandlers: true,
          autoSchemaFile: join(process.cwd(), 'src/graphql/schema.gql'),
          ...options,
        }),
      ],
    }
  }
}
