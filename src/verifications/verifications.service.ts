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
import { GetUserByVidDTO } from '@/users/dtos/get-user-by-vid.dto'

@Injectable()
export class VerificationsService {
  constructor(private readonly baseService: BaseService) {}

  async createVerification(userId: string) {
    const repository = this.baseService.getManager().getRepository(Verification)
    const newVerification = await repository.save(
      repository.create({
        userId,
      }),
    )

    return newVerification
  }

  async getVerificationByVid(getUserByVidDTO: GetUserByVidDTO) {
    const userWhereCond: FindOptionsWhere<Users> = {
      [getUserByVidDTO.type.toLowerCase()]: getUserByVidDTO.vid,
      verified: IsNull(),
    }
    const repository = this.baseService.getManager().getRepository(Verification)
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
    const foundUserVerification = await this.getVerificationByVid(verifyCodeDTO)

    if (!foundUserVerification) {
      throw new NotFoundException()
    }
    if (foundUserVerification.code !== verifyCodeDTO.code) {
      throw new ForbiddenException()
    }

    return true
  }

  async removeVerification(id: string) {
    return this.baseService
      .getManager()
      .getRepository(Verification)
      .softRemove({ id })
  }

  generateRandomString(options?: {
    onlyString?: boolean
    length?: number
  }): string {
    const { onlyString, length } = options ?? {}
    // THINK: 무작위 코드 생성 시 문자열 포함하는 방향은?
    const codeLength = length ?? 6

    const characters = onlyString
      ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      : '0123456789'
    let result = ''

    for (let i = 0; i < codeLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length)
      result += characters.charAt(randomIndex)
    }

    return result
  }
}
