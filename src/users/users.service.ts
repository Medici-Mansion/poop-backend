import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { Users } from './entites/users.entity'

@Injectable()
export class UsersService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async createUser(user: Pick<Users, 'email' | 'nickname' | 'password'>) {
    // 닉네임 중복 체크
    // exist() -> 만약에 조건에 해동되는 값이 있으면 true 반환

    const nicknameExists = await this.dataSource.manager
      .getRepository(Users)
      .exists({
        where: {
          nickname: user.nickname,
        },
      })

    if (nicknameExists) {
      throw new BadRequestException('이미 존재하는 닉네임입니다.')
    }

    const emailExists = await this.dataSource.manager
      .getRepository(Users)
      .exists({
        where: {
          email: user.email,
        },
      })

    if (emailExists) {
      throw new BadRequestException('이미 존재하는 이메일입니다.')
    }

    const userObject = this.dataSource.manager.getRepository(Users).create({
      nickname: user.nickname,
      email: user.email,
      password: user.password,
    })

    const newUser = await this.dataSource.manager
      .getRepository(Users)
      .save(userObject)

    return newUser
  }

  async getAllUsers() {
    return this.dataSource.manager.getRepository(Users).find()
  }

  async getUserByEmail(email: string) {
    return this.dataSource.manager.getRepository(Users).findOne({
      where: {
        email,
      },
    })
  }
}
