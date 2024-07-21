import { Module } from '@nestjs/common'
import { NestjsFormDataModule } from 'nestjs-form-data'

import { BaseService } from '@/shared/services/base.service'
import { ProfilesService } from '@/profiles/profiles.service'

import { ProfilesController } from '@/profiles/profiles.controller'

import { UsersModule } from '@/users/users.module'
import { ExternalsModule } from '@/externals/externals.module'
import { BreedsModule } from '@/breeds/breeds.module'

import { ProfilesRepository } from '@/profiles/profiles.repository'
import { EsModule } from '@/externals/modules/es/es.module'

@Module({
  imports: [
    NestjsFormDataModule,
    UsersModule,
    ExternalsModule,
    BreedsModule,
    EsModule,
  ],
  controllers: [ProfilesController],
  providers: [BaseService, ProfilesService, ProfilesRepository],
})
export class ProfilesModule {}
