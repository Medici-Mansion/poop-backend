import { Module } from '@nestjs/common'
import { ProfilesService } from '@/profiles/profiles.service'
import { ProfilesController } from '@/profiles/profiles.controller'

@Module({
  controllers: [ProfilesController],
  providers: [ProfilesService],
})
export class ProfilesModule {}
