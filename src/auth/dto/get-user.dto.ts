import { Accounts, PROVIDER } from '@/users/models/users.model'
import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql'

@InputType()
export class GetUserFromProviderInput extends PickType(Accounts, [
  'provider',
]) {}

@ObjectType()
export class GetUserFromProviderOutPut {
  @Field((type) => PROVIDER)
  provider: PROVIDER[number]
}
