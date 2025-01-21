import { Global, Module } from '@nestjs/common';

// Global module for providers and modules needed in all parts of the application (e.g., LoggerService, CqrsModule, etc...)
@Global()
@Module({
  // exports: [GlobalLoggerService],
})
export class CoreModule {}
