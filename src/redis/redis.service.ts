import { InjectRedis } from '@liaoliaots/nestjs-redis'
import { Injectable } from '@nestjs/common'
import { Redis } from 'ioredis'

@Injectable()
export class RedisService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async findById(id: string) {
    return this.redis.get(id)
  }
  async setPasswordCode(id: string, code: string) {
    return this.redis.set(id, code, 'EX', 60 * 60)
  }

  async setChangePasswordCode(id: string, code: string) {
    let delFn = new Promise<number>((resolve) => resolve(0))
    const foundExistCodeById = this.findById(id)
    if (foundExistCodeById) {
      delFn = this.removeByKey(id)
    }
    return await Promise.all([
      delFn,
      this.redis.set(`PASSWORD_CHANGE:${code}`, id, 'EX', 60 * 60),
    ])
  }

  async getChangePasswordCode(code: string) {
    const id = await this.redis.get(`PASSWORD_CHANGE:${code}`)
    return {
      id,
      key: `PASSWORD_CHANGE:${code}`,
    }
  }

  async removeByKey(id: string) {
    return this.redis.del(id)
  }
}
