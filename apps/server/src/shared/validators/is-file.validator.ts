import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator'

export function IsFile(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isFile',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return value instanceof Buffer // 예시에서는 Buffer 인스턴스인지 확인합니다.
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a file`
        },
      },
    })
  }
}
