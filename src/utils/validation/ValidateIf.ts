import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function ValidateIf(condition: (value: any) => boolean, validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'validateIf',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return condition(value);
        },
      },
    });
  };
}
