import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { BaseService } from '@/shared/services/base.service'

import { VerifyCodeDTO } from '@/verifications/dtos/verify-code.dto'
import { GetUserByVidDTO } from '@/users/dtos/get-user-by-vid.dto'
import { Prisma } from '@prisma/client'
import { PrismaService } from '@/prisma/prisma.service'

@Injectable()
export class VerificationsService {
  constructor(
    private readonly baseService: BaseService,
    private readonly prismaService: PrismaService,
  ) {}

  async createVerification(userId: string) {
    // const repository = this.baseService.getManager().getRepository(Verification)
    const newVerification = await this.prismaService.verification.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
        code: this.generateRandomString({ onlyString: false, length: 6 }),
      },
    })

    return newVerification
  }

  async getVerificationByVid(getUserByVidDTO: GetUserByVidDTO) {
    const userWhereCond: Prisma.UserWhereInput = {
      [getUserByVidDTO.type.toLowerCase()]: getUserByVidDTO.vid,
      verified: null,
    }
    const foundUserVerification =
      await this.prismaService.verification.findFirst({
        where: {
          user: {
            ...userWhereCond,
          },
        },
        include: {
          user: true,
        },
      })
    console.log(foundUserVerification, '<<foundUserVerification')
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
    return this.prismaService.verification.delete({ where: { id } })
  }

  async refreshVerificationCode(verificationId: string) {
    const foundVerification = await this.prismaService.verification.findUnique({
      where: { id: verificationId },
    })

    if (!foundVerification) throw new NotFoundException()
    const newVerification = this.prismaService.verification.update({
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
