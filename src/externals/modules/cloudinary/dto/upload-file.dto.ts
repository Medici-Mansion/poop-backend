import { UploadApiResponse } from 'cloudinary'

export class UploadFileDTO implements UploadApiResponse {
  public_id: string
  version: number
  signature: string
  width: number
  height: number
  format: string
  resource_type: 'image' | 'video' | 'raw' | 'auto'
  created_at: string
  tags: string[]
  pages: number
  bytes: number
  type: string
  etag: string
  placeholder: boolean
  url: string
  secure_url: string
  access_mode: string
  original_filename: string
  moderation: string[]
  access_control: string[]
  context: object
  metadata: object
  colors?: [string, number][]

  constructor(uploadApiResponse: PromiseSettledResult<UploadApiResponse>) {
    if (uploadApiResponse.status === 'fulfilled') {
      const { value } = uploadApiResponse
      this.public_id = value.public_id
      this.version = value.version
      this.signature = value.signature
      this.width = value.width
      this.height = value.height
      this.format = value.format
      this.resource_type = value.resource_type
      this.created_at = value.created_at
      this.tags = value.tags
      this.pages = value.pages
      this.bytes = value.bytes
      this.type = value.type
      this.etag = value.etag
      this.placeholder = value.placeholder
      this.url = value.url
      this.secure_url = value.secure_url
      this.access_mode = value.access_mode
      this.original_filename = value.original_filename
      this.moderation = value.moderation
      this.access_control = value.access_control
      this.context = value.context
      this.metadata = value.metadata
      this.colors = value.colors
    } else {
      return
    }
  }
}
