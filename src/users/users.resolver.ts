import { UsersService } from '@/users/users.service'
import { Query, Resolver } from '@nestjs/graphql'
import { Users } from './models/users.model'

@Resolver((of) => Users)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}
  @Query(() => [Users])
  async getAllUsers() {
    return this.usersService.getAllUsers()
  }
}
