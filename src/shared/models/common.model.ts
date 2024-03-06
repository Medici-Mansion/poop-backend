import {
  BaseEntity,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

export class CommonModel extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @CreateDateColumn({ comment: '생성일자' })
  createdAt: Date

  @UpdateDateColumn({ comment: '수정일자' })
  updatedAt: Date

  @DeleteDateColumn({ comment: '삭제일자' })
  deletedAt: Date
}
