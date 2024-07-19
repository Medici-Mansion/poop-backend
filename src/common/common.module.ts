import { Module } from '@nestjs/common'

import { BreedsModule } from '@/breeds/breeds.module'
import { GraphicsModule } from '@/graphics/graphics.module'

@Module({
  imports: [BreedsModule, GraphicsModule],
})
export class CommonModule {}
