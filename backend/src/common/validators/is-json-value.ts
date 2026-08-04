import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsJsonValue(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isJsonValue',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          return value === null || Array.isArray(value) || typeof value === 'object';
        },
      },
    });
  };
}
