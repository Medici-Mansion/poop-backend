import { Module } from '@nestjs/common'

import { BreedsService } from '@/breeds/breeds.service'
import { BaseService } from '@/shared/services/base.service'

import { BreedsRepository } from '@/breeds/breeds.repository'

@Module({
  providers: [BaseService, BreedsService, BreedsRepository],
  exports: [BreedsService],
})
export class BreedsModule {}
