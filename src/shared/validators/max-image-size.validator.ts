import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
import { MemoryStoredFile } from 'nestjs-form-data'
import sizeOf from 'buffer-image-size'

import { ImageInfo } from '@/shared/interfaces/image.interface'

@ValidatorConstraint({ async: true })
export class MaxImageSizeContrant implements ValidatorConstraintInterface {
  validate(value: MemoryStoredFile, args: ValidationArguments) {
    const size = args.constraints[0]
    if (!value.buffer || !size) return false
    const dimemsion = sizeOf(value.buffer)
    for (const key in size) {
      if (size[key] < dimemsion[key]) return false
    }
    return true
  }
}
export function MaxImageSize<T extends object>(
  size?: ImageInfo,
  validationOptions?: ValidationOptions,
) {
  return function (object: T, propertyName: string) {
    registerDecorator({
      name: 'MaxImageSize',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [size],
      options: {
        message: '이미지 크기가 너무 커요.',
        ...validationOptions,
      },
      validator: MaxImageSizeContrant,
    })
  }
}
