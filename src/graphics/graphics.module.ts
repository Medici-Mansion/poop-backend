import { GraphicsRepository } from './grahics.repository'
import { Module } from '@nestjs/common'
import { GraphicsService } from '@/graphics/graphics.service'
import { NestjsFormDataModule } from 'nestjs-form-data'
import { ExternalsModule } from '@/externals/externals.module'

@Module({
  imports: [NestjsFormDataModule, ExternalsModule],
  providers: [GraphicsRepository, GraphicsService],
  exports: [GraphicsService],
})
export class GraphicsModule {}
