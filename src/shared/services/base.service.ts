import { ConfigService } from '@nestjs/config'
import { Inject } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource, EntityManager } from 'typeorm'
import { FastifyRequest } from 'fastify'

import { Env } from '@/shared/interfaces/env.interface'
import { MANAGER_KEY } from '@poop/common'

export class BaseService {
  @InjectDataSource()
  private readonly dataSource: DataSource
  @Inject(REQUEST)
  private readonly request: FastifyRequest
  @Inject(ConfigService)
  private readonly config: ConfigService<Env>

  constructor() {}

  get configService() {
    return this.config
  }

  protected getManager(): EntityManager {
    return this.request[MANAGER_KEY] ?? this.dataSource.manager
  }
}
