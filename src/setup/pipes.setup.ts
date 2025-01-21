import { INestApplication, ValidationPipe } from '@nestjs/common';

export function pipesSetup(app: INestApplication) {
  //Global pipe for validation and transformation of incoming data.

  app.useGlobalPipes(
    new ValidationPipe({
      //class-transformer creates an instance of dto
      //therefore, default values will be applied
      //inheritance will work
      //and methods of dto classes
      transform: true,
    }),
  );
}
