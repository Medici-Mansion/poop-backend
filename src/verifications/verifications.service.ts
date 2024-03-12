import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { FindOptionsWhere, IsNull } from 'typeorm'

import { Verification } from '@/verifications/models/verification.model'
import { Users } from '@/users/models/users.model'

import { BaseService } from '@/shared/services/base.service'

import { VerifyCodeDTO } from '@/verifications/dtos/verify-code.dto'
import { GetUserByVidDTO } from '@/verifications/dtos/get-user-by-vid.dto'

@Injectable()
export class VerificationsService extends BaseService {
  private readonly codeLength = 6
  constructor() {
    super()
  }

  async createVerification(userId: string) {
    const repository = this.getManager().getRepository(Verification)
    const newVerification = await repository.save(
      repository.create({
        userId,
      }),
    )

    return newVerification
  }

  async getUserByVid(getUserByVidDTO: GetUserByVidDTO) {
    const userWhereCond: FindOptionsWhere<Users> = {
      [getUserByVidDTO.type.toLowerCase()]: getUserByVidDTO.vid,
      verified: IsNull(),
    }
    const repository = this.getManager().getRepository(Verification)
    const foundUserVerification = await repository.findOne({
      where: {
        user: {
          ...userWhereCond,
        },
      },
      relations: {
        user: true,
      },
    })

    if (!foundUserVerification) {
      throw new NotFoundException()
    }
    return foundUserVerification
  }

  async verifyingCode(verifyCodeDTO: VerifyCodeDTO) {
    const foundUserVerification = await this.getUserByVid(verifyCodeDTO)

    if (!foundUserVerification) {
      throw new NotFoundException()
    }
    if (foundUserVerification.code !== verifyCodeDTO.code) {
      throw new ForbiddenException()
    }

    return foundUserVerification
  }
  async removeVerification(id: string) {
    return this.getManager().getRepository(Verification).softRemove({ id })
  }

  generateRandomString(): string {
    // THINK: 무작위 코드 생성 시 문자열 포함하는 방향은?
    // const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    const characters = '0123456789'
    let result = ''

    for (let i = 0; i < this.codeLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length)
      result += characters.charAt(randomIndex)
    }

    return result
  }
}
