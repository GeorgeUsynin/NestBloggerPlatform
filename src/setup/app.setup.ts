import { INestApplication } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { globalPrefixSetup } from './global-prefix.setup';
import { pipesSetup } from './pipes.setup';
import { swaggerSetup } from './swagger.setup';
import { exceptionFilterSetup } from './exception-filter.setup';
import { CoreConfig } from '../core/config';

export function appSetup(app: INestApplication, coreConfig: CoreConfig) {
  // Enable CORS
  app.enableCors();
  // Setup global pipes
  pipesSetup(app);
  // Setup global prefix
  globalPrefixSetup(app);
  // Setup swagger
  swaggerSetup(app, coreConfig);
  // Setup exception filters
  exceptionFilterSetup(app, coreConfig);
  // Add cookie parser
  app.use(cookieParser());
}
