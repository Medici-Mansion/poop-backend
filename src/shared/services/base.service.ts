import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource, EntityManager } from 'typeorm'
import { FastifyRequest } from 'fastify'
import { MANAGER_KEY } from '@/shared/constants/common.constants'
import { Inject } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'

export class BaseService {
  @InjectDataSource()
  private readonly dataSource: DataSource
  @Inject(REQUEST)
  private readonly request: FastifyRequest
  constructor() {}

  protected getManager(): EntityManager {
    return this.request[MANAGER_KEY] ?? this.dataSource.manager
  }
}
