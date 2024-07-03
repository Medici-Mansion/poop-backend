import { ConfigService } from '@nestjs/config'
import { Module } from '@nestjs/common'
import { AWS_S3 } from '@/externals/modules/aws/aws.constants'
import { Env } from '@/shared/interfaces/env.interface'
import { S3Client } from '@aws-sdk/client-s3'
import { AwsService } from '@/externals/modules/aws/aws.service'

@Module({
  providers: [
    {
      provide: AWS_S3,
      useFactory(configService: ConfigService<Env>) {
        const client = new S3Client({
          region: configService.get('AWS_S3_REGION')!,
          credentials: {
            accessKeyId: configService.get('AWS_S3_ACCESS_KEY')!,
            secretAccessKey: configService.get('AWS_S3_ACCESS_SECRET_KEY')!,
          },
        })
        return client
      },
      inject: [ConfigService],
    },
    AwsService,
  ],
  exports: [AwsService],
})
export class AwsModule {}
