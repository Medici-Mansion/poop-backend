import { ConfigService } from '@nestjs/config'
import { Inject, Injectable } from '@nestjs/common'
import { Env } from '@/shared/interfaces/env.interface'

@Injectable()
export class BaseService {
  constructor(
    @Inject(ConfigService)
    private readonly config: ConfigService<Env>,
  ) {}
  get conf() {
    return this.config
  }
}
