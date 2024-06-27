import { Module } from '@nestjs/common'

import { BreedsService } from '@/breeds/breeds.service'
import { BaseService } from '@/shared/services/base.service'

import { BreedsRepository } from '@/breeds/breeds.repository'
import { BreedsController } from './breeds.controller'

@Module({
  providers: [BaseService, BreedsService, BreedsRepository, BreedsController],
  exports: [BreedsService],
})
export class BreedsModule {}
