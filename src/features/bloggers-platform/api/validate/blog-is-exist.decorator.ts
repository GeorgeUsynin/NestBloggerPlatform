import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { BlogsRepository } from '../../infrastructure/blogs.repository';

// Обязательна регистрация в ioc
// Внимание! Используем такой подход только в исключительных случаях.
// Данный пример служит для демонстрации.
// Такую проверку делаем в BLL.
// В домашнем задании этот способ применим при создании поста,
// когда blogId передается в body. Для формирования общего массива ошибок.

@ValidatorConstraint({ name: 'BlogIsExist', async: true })
@Injectable()
export class BlogIsExistConstraint implements ValidatorConstraintInterface {
  constructor(private readonly blogsRepository: BlogsRepository) {}
  async validate(value: any, args: ValidationArguments) {
    const blogIsExist = await this.blogsRepository.findBlogById(value);
    return Boolean(blogIsExist);
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return `Blog with the specified blogId (${validationArguments?.value}) was not found.`;
  }
}

// https://github.com/typestack/class-validator?tab=readme-ov-file#custom-validation-decorators
export function BlogIsExist(
  property?: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: BlogIsExistConstraint,
    });
  };
}
