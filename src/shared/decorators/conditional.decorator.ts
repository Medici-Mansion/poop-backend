import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator'

export function ConditionalValidation(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'conditionalValidation',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName, constraints] = args.constraints
          const relatedValue = (args.object as any)[relatedPropertyName]
          if (relatedValue) {
            for (const constraint of constraints) {
              if (!constraint.validate(value, args)) {
                return false
              }
            }
          }
          return true
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName, constraints] = args.constraints
          return constraints
            .map((constraint) => constraint.defaultMessage(args))
            .join(', ')
        },
      },
    })
  }
}
