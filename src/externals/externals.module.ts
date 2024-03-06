import { Module } from '@nestjs/common'
import { ExternalsService } from '@/externals/externals.service'
import { HttpModule } from '@nestjs/axios'

@Module({
  imports: [HttpModule],
  providers: [ExternalsService],
  exports: [ExternalsService],
})
export class ExternalsModule {}
