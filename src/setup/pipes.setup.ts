import { INestApplication, ValidationPipe } from '@nestjs/common';

export function pipesSetup(app: INestApplication) {
  //Глобальный пайп для валидации и трансформации входящих данных.

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
