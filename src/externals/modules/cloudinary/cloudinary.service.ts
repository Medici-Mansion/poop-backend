import { Inject, Injectable } from '@nestjs/common'
import { UploadApiResponse, v2 } from 'cloudinary'

import { CLOUDINARY } from '@/externals/modules/cloudinary/cloudinary.constants'

import { UploadFileDTO } from '@/externals/modules/cloudinary/dto/upload-file.dto'
import { MemoryStoredFile } from 'nestjs-form-data'

@Injectable()
export class CloudinaryService {
  constructor(@Inject(CLOUDINARY) private readonly cloudinary: typeof v2) {}

  async uploadFiles(files: MemoryStoredFile[], folder: string = '') {
    const uploadSettles = await Promise.allSettled(
      files.map(
        (file) =>
          new Promise<UploadApiResponse>((resolve, reject) => {
            this.cloudinary.uploader
              .upload_stream(
                {
                  folder,
                },
                (error, result) => {
                  if (error) reject(error)
                  else resolve(result)
                },
              )
              .end(file.buffer)
          }),
      ),
    )
    return uploadSettles.map((settles) => new UploadFileDTO(settles))
  }
}
