import { Global, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CoreConfig } from './config';

// Global module for providers and modules needed in all parts of the application (e.g., LoggerService, CqrsModule, etc...)
@Global()
@Module({
  imports: [CqrsModule],
  providers: [CoreConfig],
  exports: [CoreConfig, CqrsModule],
})
export class CoreModule {}
