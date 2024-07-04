import { Inject, Injectable } from '@nestjs/common'
import { UploadApiResponse, v2 } from 'cloudinary'

import { CLOUDINARY } from '@/externals/modules/cloudinary/cloudinary.constants'

import { MemoryStoredFile } from 'nestjs-form-data'

@Injectable()
export class CloudinaryService {
  constructor(@Inject(CLOUDINARY) private readonly cloudinary: typeof v2) {}

  async uploadFiles(
    files: MemoryStoredFile[],
    folder: string = '',
  ): Promise<string[]> {
    const uploadSettles = await Promise.all(
      files.map(
        (file) =>
          new Promise<UploadApiResponse>((resolve, reject) => {
            this.cloudinary.uploader
              .upload_stream(
                {
                  folder,
                },
                (error, result) => {
                  if (error || !result) reject(error)
                  else resolve(result)
                },
              )
              .end(file.buffer)
          }),
      ),
    )
    return uploadSettles.map((file) => file.secure_url)
  }
}
