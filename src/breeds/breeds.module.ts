import { Module } from '@nestjs/common'

import { BreedsService } from '@/breeds/breeds.service'
import { BaseService } from '@/shared/services/base.service'

import { BreedsRepository } from '@/breeds/breeds.repository'
import { BreedsController } from './breeds.controller'
import { ExternalsModule } from '@/externals/externals.module'

@Module({
  imports: [ExternalsModule],
  providers: [BaseService, BreedsService, BreedsRepository],
  exports: [BreedsService],
  controllers: [BreedsController],
})
export class BreedsModule {}
