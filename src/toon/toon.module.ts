import { Module } from '@nestjs/common'
import { ToonService } from '@/toon/toon.service'
import { ToonController } from '@/toon/toon.controller'

@Module({
  controllers: [ToonController],
  providers: [ToonService],
})
export class ToonModule {}
