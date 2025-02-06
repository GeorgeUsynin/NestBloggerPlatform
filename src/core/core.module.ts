import { Global, Module } from '@nestjs/common';
import { CoreConfig } from './config';

// Global module for providers and modules needed in all parts of the application (e.g., LoggerService, CqrsModule, etc...)
@Global()
@Module({
  providers: [CoreConfig],
  exports: [CoreConfig],
})
export class CoreModule {}
