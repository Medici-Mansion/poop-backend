import { GraphicsRepository } from './grahics.repository'
import { Module } from '@nestjs/common'
import { GraphicsService } from '@/graphics/graphics.service'

@Module({
  providers: [GraphicsRepository, GraphicsService],
  exports: [GraphicsService],
})
export class GraphicsModule {}
