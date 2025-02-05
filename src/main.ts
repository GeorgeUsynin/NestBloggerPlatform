import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appSetup } from './setup/app.setup';
import { createWriteStream } from 'fs';
import { get } from 'http';
import { AppConfig } from './app.config';

async function bootstrap() {
  // Create the NestJS application
  const app = await NestFactory.create(AppModule);
  const appConfig = app.get<AppConfig>(AppConfig);

  // Setup the application
  appSetup(app);

  // Start the server
  await app.listen(appConfig.PORT);

  // get the swagger json file (if app is running in development mode)
  if (appConfig.NODE_ENV === 'development') {
    // write swagger ui files
    get(
      `${appConfig.SERVER_URL}/api/swagger-ui-bundle.js`,
      function (response) {
        response.pipe(createWriteStream('swagger-static/swagger-ui-bundle.js'));
        console.log(
          `Swagger UI bundle file written to: '/swagger-static/swagger-ui-bundle.js'`,
        );
      },
    );

    get(`${appConfig.SERVER_URL}/api/swagger-ui-init.js`, function (response) {
      response.pipe(createWriteStream('swagger-static/swagger-ui-init.js'));
      console.log(
        `Swagger UI init file written to: '/swagger-static/swagger-ui-init.js'`,
      );
    });

    get(
      `${appConfig.SERVER_URL}/api/swagger-ui-standalone-preset.js`,
      function (response) {
        response.pipe(
          createWriteStream('swagger-static/swagger-ui-standalone-preset.js'),
        );
        console.log(
          `Swagger UI standalone preset file written to: '/swagger-static/swagger-ui-standalone-preset.js'`,
        );
      },
    );

    get(`${appConfig.SERVER_URL}/api/swagger-ui.css`, function (response) {
      response.pipe(createWriteStream('swagger-static/swagger-ui.css'));
      console.log(
        `Swagger UI css file written to: '/swagger-static/swagger-ui.css'`,
      );
    });
  }
}

bootstrap();
