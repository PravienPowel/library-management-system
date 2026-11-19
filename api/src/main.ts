import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // checks every incoming body against our DTOs
  // whitelist: true removes any extra fields that are not in the DTO
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // lets other sites (like a frontend) call this API
  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();