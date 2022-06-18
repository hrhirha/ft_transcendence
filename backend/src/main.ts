import { ArgumentsHost, Catch, ExceptionFilter, HttpException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import { Request, Response } from 'express';
import { join } from 'path';
import { AppModule } from './app.module';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const method = request.method;

    response
      .status(status)
      .json({
        statusCode: status,
        method,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
  }
}

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
    origin: `http://127.0.0.1:3000`,
    credentials: true,
  });
  app.useGlobalFilters(new HttpExceptionFilter);
  await app.listen(3001);
}
bootstrap();
