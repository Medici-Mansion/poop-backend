import { Module } from '@nestjs/common'

import { BreedsService } from '@/breeds/breeds.service'
import { BaseService } from '@/shared/services/base.service'

@Module({
  providers: [BaseService, BreedsService],
  exports: [BreedsService],
})
export class BreedsModule {}
