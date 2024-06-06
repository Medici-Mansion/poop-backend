import { Module } from '@nestjs/common';
import { ToonService } from './toon.service';
import { ToonController } from './toon.controller';

@Module({
  controllers: [ToonController],
  providers: [ToonService],
})
export class ToonModule {}
