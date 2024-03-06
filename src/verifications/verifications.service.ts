import { Injectable, NotFoundException } from '@nestjs/common'
import { Verification } from './models/verification.model'
import { BaseService } from '@/shared/services/base.service'
import { VerifyCodeDTO } from '@/verifications/dtos/verify-code.dto'
import { Users } from '@/users/models/users.model'
import { FindOptionsWhere } from 'typeorm'

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

  async verifyingCode(verifyCodeDTO: VerifyCodeDTO) {
    const userWhereCond: FindOptionsWhere<Users> = {
      [verifyCodeDTO.type.toLowerCase()]: verifyCodeDTO.vid,
      verified: false,
    }
    const repository = this.getManager().getRepository(Verification)
    const foundUserVerification = await repository.findOne({
      where: {
        code: verifyCodeDTO.code,
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
    const foundUser = foundUserVerification.user

    return foundUser
  }
}
