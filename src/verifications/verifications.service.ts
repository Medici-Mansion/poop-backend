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

    const foundUser = foundUserVerification.user

    return foundUser
  }
}
