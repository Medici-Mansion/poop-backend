import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { AuthService } from './auth.service'
import {
  GetUserFromProviderInput,
  GetUserFromProviderOutPut,
} from './dto/get-user.dto'

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation((returns) => GetUserFromProviderOutPut)
  async getUserFromServiceProvider(
    @Args('input')
    getUserFromProviderInput: GetUserFromProviderInput,
  ): Promise<GetUserFromProviderOutPut> {
    return { provider: getUserFromProviderInput.provider }
  }
}
