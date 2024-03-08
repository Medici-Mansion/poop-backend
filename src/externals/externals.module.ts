import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'

import { ExternalsService } from '@/externals/externals.service'
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module'

@Module({
  imports: [HttpModule, CloudinaryModule],
  providers: [ExternalsService],
  exports: [ExternalsService],
})
export class ExternalsModule {}
