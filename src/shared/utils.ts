import { STORAGE_BASE_URL } from '@/shared/constants/storage.constant'

interface GetImageOptions {
  width?: number
  quality?: number
  prefix?: string
}

export function getImagePath(imageName?: string, options?: GetImageOptions) {
  const { width = 'auto', quality = 'auto', prefix = '' } = options ?? {}

  return imageName
    ? `${STORAGE_BASE_URL}/image/upload/f_auto,w_${width},q_${quality}/v1/${[prefix, imageName].filter((item) => item).join('/')}`
    : ''
}
