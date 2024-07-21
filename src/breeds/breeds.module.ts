import { Module } from '@nestjs/common'

import { BreedsService } from '@/breeds/breeds.service'
import { BaseService } from '@/shared/services/base.service'

import { BreedsRepository } from '@/breeds/breeds.repository'
import { BreedsController } from './breeds.controller'
import { ExternalsModule } from '@/externals/externals.module'
import { EsModule } from '@/externals/modules/es/es.module'

@Module({
  imports: [ExternalsModule, EsModule],
  providers: [BaseService, BreedsService, BreedsRepository],
  exports: [BreedsService],
  controllers: [BreedsController],
})
export class BreedsModule {}
