import { Module } from '@nestjs/common'
import { CloudinaryService } from '@/externals/modules/cloudinary/cloudinary.service'
import { CLOUDINARY } from '@/externals/modules/cloudinary/cloudinary.constants'
import { ConfigService } from '@nestjs/config'
import { v2 as cloudinary } from 'cloudinary'
import { Env } from '@/shared/interfaces/env.interface'

@Module({
  providers: [
    {
      provide: CLOUDINARY,
      useFactory(configService: ConfigService<Env>) {
        cloudinary.config({
          cloud_name: configService.get('CLOUDINARY_CLOUD_NAME'),
          api_key: configService.get('CLOUDINARY_API_KEY'),
          api_secret: configService.get('CLOUDINARY_API_SECRET'),
        })

        return cloudinary
      },
      inject: [ConfigService],
    },
    CloudinaryService,
  ],
  exports: [CloudinaryService],
})
export class CloudinaryModule {}
