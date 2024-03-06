import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'

import { ExternalsService } from '@/externals/externals.service'

@Module({
  imports: [HttpModule],
  providers: [ExternalsService],
  exports: [ExternalsService],
})
export class ExternalsModule {}
