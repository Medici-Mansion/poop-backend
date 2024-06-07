import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { VerifyCodeDTO } from '@/verifications/dtos/verify-code.dto'
import { GetUserByVidDTO } from '@/users/dtos/get-user-by-vid.dto'
import { Insertable } from 'kysely'
import { verification } from '@/database/types'
import { VerificationsRepository } from './verifications.repository'

@Injectable()
export class VerificationsService {
  constructor(
    private readonly verificationsRepository: VerificationsRepository,
  ) {}

  async getVerificationByVid(getUserByVidDTO: GetUserByVidDTO) {
    const foundUserVerification =
      await this.verificationsRepository.findOneByUserVid(
        getUserByVidDTO.type,
        getUserByVidDTO.vid,
      )

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
    return this.verificationsRepository.delete(id)
  }

  async refreshVerificationCode(verificationId: string) {
    const foundVerification = await this.verificationsRepository.findOneBy(
      'id',
      verificationId,
    )

    if (!foundVerification) throw new NotFoundException()

    const newVerification = await this.verificationsRepository.update(
      foundVerification.id,
      {
        code: this.generateRandomString({ onlyString: false, length: 6 }),
      },
    )
    return newVerification
  }

  async create(createVerificationDTO: Insertable<verification>) {
    return this.verificationsRepository.create(createVerificationDTO)
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
