import { Module } from '@nestjs/common'

import { CommonController } from '@/common/common.controller'

import { BreedsModule } from '@/breeds/breeds.module'
import { GraphicsModule } from '@/graphics/graphics.module'

@Module({
  imports: [BreedsModule, GraphicsModule],
  controllers: [CommonController],
})
export class CommonModule {}
