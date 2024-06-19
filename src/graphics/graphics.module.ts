import { Module } from '@nestjs/common'
import { GraphicsService } from '@/graphics/graphics.service'

@Module({
  providers: [GraphicsService],
})
export class GraphicsModule {}
