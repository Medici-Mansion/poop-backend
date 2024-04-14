import { type BusboyConfig } from '@fastify/busboy'
import { FastifyRequest } from 'fastify'
import {
  BadRequestException,
  ExecutionContext,
  createParamDecorator,
} from '@nestjs/common'

type GetFilesOptions = Omit<BusboyConfig, 'headers'> & { tmpdir?: string }
export const GetFiles = createParamDecorator(
  async (options: GetFilesOptions, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest() as FastifyRequest
    const files = await request.saveRequestFiles({
      ...options,
    })
    if (!files.length) throw new BadRequestException()
    return files
  },
)
