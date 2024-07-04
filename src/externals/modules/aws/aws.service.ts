import { Inject } from '@nestjs/common'
import { AWS_S3 } from '@/externals/modules/aws/aws.constants'
import { S3Client, PutObjectCommand, ObjectCannedACL } from '@aws-sdk/client-s3'
import { MemoryStoredFile } from 'nestjs-form-data'
import { v4 as uuid } from 'uuid'
import { ConfigService } from '@nestjs/config'
import { Env } from '@/shared/interfaces/env.interface'
import { ApiException } from '@/shared/exceptions/exception.interface'

export class AwsService {
  constructor(
    private readonly configService: ConfigService<Env>,
    @Inject(AWS_S3) private readonly s3Client: S3Client,
  ) {}

  async uploadFiles(files: MemoryStoredFile[], folder: string = '') {
    try {
      const uploadUrls = await Promise.all(
        files.map(
          (file) =>
            new Promise<string>(async (resolve) => {
              const key = folder + '/' + uuid()
              const command = new PutObjectCommand({
                Key: key,
                Body: file.buffer,
                Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
                ACL: ObjectCannedACL.public_read,
              })
              await this.s3Client.send(command)
              resolve(
                `https://${this.configService.get('AWS_S3_BUCKET_NAME')}.s3.${this.configService.get<string>('AWS_S3_REGION')}.amazonaws.com/${key}`,
              )
            }),
        ),
      )
      return uploadUrls
    } catch (err) {
      throw ApiException.PLAIN_BAD_REQUEST()
    }
  }
}
