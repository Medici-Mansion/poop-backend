import { DataSourceService } from './../prisma/datasource.service'
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { VerifyCodeDTO } from '@/verifications/dtos/verify-code.dto'
import { GetUserByVidDTO } from '@/users/dtos/get-user-by-vid.dto'
import { Prisma } from '@prisma/client'

@Injectable()
export class VerificationsService {
  constructor(private readonly dataSourceService: DataSourceService) {}

  async getVerificationByVid(getUserByVidDTO: GetUserByVidDTO) {
    const userWhereCond: Prisma.UserWhereInput = {
      [getUserByVidDTO.type.toLowerCase()]: getUserByVidDTO.vid,
      verified: null,
    }
    const foundUserVerification =
      await this.dataSourceService.manager.verification.findFirst({
        where: {
          user: {
            ...userWhereCond,
          },
        },
        include: {
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
    return this.dataSourceService.manager.verification.delete({ where: { id } })
  }

  async refreshVerificationCode(verificationId: string) {
    const foundVerification =
      await this.dataSourceService.manager.verification.findUnique({
        where: { id: verificationId },
      })

    if (!foundVerification) throw new NotFoundException()
    const newVerification = this.dataSourceService.manager.verification.update({
      where: { id: foundVerification.id },
      data: {
        code: this.generateRandomString({ onlyString: false, length: 6 }),
      },
    })
    return newVerification
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
