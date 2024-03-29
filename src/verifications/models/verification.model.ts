import { BeforeInsert, Column, Entity, JoinColumn, OneToOne } from 'typeorm'
import { CommonModel } from '@/shared/models/common.model'
import { Users } from '@/users/models/users.model'

interface VerificationsFields {
  code: string
  userId: string
}

@Entity()
export class Verification extends CommonModel {
  private readonly codeLength = 6

  @Column({ type: 'varchar' })
  code: string

  @Column({ type: 'uuid' })
  userId: string

  @OneToOne((type) => Users, {
    cascade: ['soft-remove'],
    createForeignKeyConstraints: false,
  })
  @JoinColumn()
  user: Users

  @BeforeInsert()
  createCode(): void {
    const code = this.generateRandomString()
    this.code = code
  }

  protected generateRandomString(): string {
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

  static of({ code, userId }: VerificationsFields): Verification {
    const verification = new Verification()
    verification.code = code
    verification.userId = userId
    return verification
  }
}
