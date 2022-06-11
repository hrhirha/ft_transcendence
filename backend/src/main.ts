import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // for chat dev
  app.useStaticAssets(join(__dirname, "..", "uploads"), {
    prefix: '/uploads/',
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));
  app.use(cookieParser());
  app.enableCors({
    origin: 'http://127.0.0.1:3000',
    credentials: true,
  });
  await app.listen(3001);
}
bootstrap();
