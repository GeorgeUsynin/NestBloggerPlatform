import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { appSetup } from './setup/app.setup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      //class-transformer creates an instance of dto
      //therefore, default values will be applied
      //inheritance will work
      //and methods of dto classes
      transform: true,
    }),
  );

  appSetup(app);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
