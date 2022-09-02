import { ArgumentsHost, Catch, ExceptionFilter, HttpException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { PrismaClient } from '@prisma/client';
import * as cookieParser from 'cookie-parser';
import { Request, Response } from 'express';
import { join } from 'path';
import { env } from 'process';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';
import { HOST, PORT } from './utils';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const eres = exception.getResponse();
    const method = request.method;

    response
      .status(status)
      .json({
        statusCode: status,
        error: eres["error"],
        message: eres["message"],
        method,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
  }
}

async function createRanks() {
  try {
    const pr = new PrismaService();
    await pr.rank.createMany({
      data: [
        {
          title: 'Wood',
          icon: `http://${HOST}:${PORT}/rank/wood_game_icon.svg`,
          field: `http://${HOST}:${PORT}/rank/wood_game_field.svg`,
          require: 0,
        },
        {
          title: 'Iron',
          icon: `http://${HOST}:${PORT}/rank/iron_game_icon.svg`,
          field: `http://${HOST}:${PORT}/rank/iron_game_field.svg`,
          require: 500,
        },
        {
          title: 'Bronze',
          icon: `http://${HOST}:${PORT}/rank/bronze_game_icon.svg`,
          field: `http://${HOST}:${PORT}/rank/bronze_game_field.svg`,
          require: 1000,
        },
        {
          title: 'Silver',
          icon: `http://${HOST}:${PORT}/rank/silver_game_icon.svg`,
          field: `http://${HOST}:${PORT}/rank/silver_game_field.svg`,
          require: 2000,
        },
        {
          title: 'Gold',
          icon: `http://${HOST}:${PORT}/rank/gold_game_icon.svg`,
          field: `http://${HOST}:${PORT}/rank/gold_game_field.svg`,
          require: 5000,
        },
        {
          title: 'Diamond',
          icon: `http://${HOST}:${PORT}/rank/diamond_game_icon.svg`,
          field: `http://${HOST}:${PORT}/rank/diamond_game_field.svg`,
          require: 10000,
        },
      ]
    });
    
  }
  catch (e) {}
}

async function bootstrap() {
  console.log(process.env);
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: `http://${HOST}:3000`,
    credentials: true,
  });
  
  // for chat dev
  app.useStaticAssets(join(__dirname, "..", "uploads"), {
    prefix: '/uploads/',
  });

  // game rank assets
  app.useStaticAssets(join(__dirname, "..", "assets"), {
    prefix: '/rank/',
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));
  app.use(cookieParser());
  app.useGlobalFilters(new HttpExceptionFilter);

  
  await app.listen(PORT).then(async () => {
    console.log(`server is listening on: ${HOST}:${PORT}`);
    await createRanks();
  });
}
bootstrap();
