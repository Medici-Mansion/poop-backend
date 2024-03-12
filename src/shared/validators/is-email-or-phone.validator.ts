import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'

@ValidatorConstraint({ async: true })
export class IsEmailOrPhoneNumberConstraint
  implements ValidatorConstraintInterface
{
  validate(value: any, args: ValidationArguments) {
    const emailRegex = /\S+@\S+\.\S+/
    const phoneRegex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/
    return emailRegex.test(value) || phoneRegex.test(value)
  }

  defaultMessage(args: ValidationArguments) {
    return 'Value must be a valid email or phone number'
  }
}

export function IsEmailOrPhoneNumber(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsEmailOrPhoneNumberConstraint,
    })
  }
}
