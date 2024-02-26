import { Query, Resolver } from '@nestjs/graphql'
import { UsersService } from '@/users/users.service'
import { Users } from './entites/users.entity'

@Resolver((of) => Users)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query((returnes) => [Users])
  async getAllUsers() {
    return this.usersService.getAllUsers()
  }
}
