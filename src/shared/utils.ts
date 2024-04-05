// https://res.cloudinary.com/poop-storage/image/upload/f_auto,q_auto/v1/

interface GetImageOptions {
  width?: number
  quality?: number
  prefix?: string
}

export function getImagePath(imageName?: string, options?: GetImageOptions) {
  const { width = 'auto', quality = 'auto', prefix = '' } = options ?? {}
  return imageName
    ? `https://res.cloudinary.com/poop-storage/image/upload/f_auto,w_${width},q_${quality}/v1/${[prefix, imageName].filter((item) => item).join('/')}`
    : null
}
