import { INestApplication } from '@nestjs/common';
import { AllExceptionsFilter } from '../core/exceptions/filters/all-exceptions-filter';
import { DomainExceptionsFilter } from '../core/exceptions/filters/domain-exceptions-filter';

export function exceptionFilterSetup(app: INestApplication) {
  // Connect our filters. The order is important here! (it will work from right to left)
  app.useGlobalFilters(new AllExceptionsFilter(), new DomainExceptionsFilter());
}
