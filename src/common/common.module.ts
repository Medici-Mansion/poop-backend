import { Module } from '@nestjs/common'

import { CommonController } from '@/common/common.controller'

import { BreedsModule } from '@/breeds/breeds.module'

@Module({
  imports: [BreedsModule],
  controllers: [CommonController],
})
export class CommonModule {}
