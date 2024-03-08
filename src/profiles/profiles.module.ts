import { UsersModule } from './../users/users.module'
import { Module } from '@nestjs/common'
import { NestjsFormDataModule } from 'nestjs-form-data'

import { ProfilesService } from '@/profiles/profiles.service'
import { ProfilesController } from '@/profiles/profiles.controller'

import { ExternalsModule } from '@/externals/externals.module'

@Module({
  imports: [NestjsFormDataModule, UsersModule, ExternalsModule],
  controllers: [ProfilesController],
  providers: [ProfilesService],
})
export class ProfilesModule {}
