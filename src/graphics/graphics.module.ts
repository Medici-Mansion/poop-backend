import { GraphicsRepository } from './grahics.repository'
import { Module } from '@nestjs/common'
import { GraphicsService } from '@/graphics/graphics.service'
import { NestjsFormDataModule } from 'nestjs-form-data'
import { ExternalsModule } from '@/externals/externals.module'
import { GraphicsController } from './graphics.controller';

@Module({
  imports: [NestjsFormDataModule, ExternalsModule],
  providers: [GraphicsRepository, GraphicsService],
  exports: [GraphicsService],
  controllers: [GraphicsController],
})
export class GraphicsModule {}
