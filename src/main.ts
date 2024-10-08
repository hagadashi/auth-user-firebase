import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { FirebaseAuthGuard } from './auth/firebase/firebase-auth.guard';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());

  const reflector = app.get(Reflector); 
  app.useGlobalGuards(new FirebaseAuthGuard(reflector));

  await app.listen(3000);
}

bootstrap();
