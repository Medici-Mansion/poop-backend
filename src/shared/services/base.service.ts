import { ConfigService } from '@nestjs/config'
import { Inject, Injectable } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource, EntityManager } from 'typeorm'
import { FastifyRequest } from 'fastify'

import { Env } from '@/shared/interfaces/env.interface'
import { MANAGER_KEY } from '@/shared/constants/common.constant'

@Injectable()
export class BaseService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    @Inject(REQUEST)
    private readonly request: FastifyRequest,
    @Inject(ConfigService)
    private readonly config: ConfigService<Env>,
  ) {}
  get conf() {
    return this.config
  }

  public getManager(): EntityManager {
    return this.request?.[MANAGER_KEY] ?? this.dataSource.manager
  }
}
