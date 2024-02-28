import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { Users } from './models/users.model'

@Injectable()
export class UsersService {
  constructor(@InjectDataSource() private readonly connection: DataSource) {}

  async getAllUsers() {
    return await this.connection.getRepository(Users).find()
  }
}
