import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

import { TimeoutInterceptor } from './interceptors/timeout/timeout.interceptor';
import { DataSource } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: ['https://hoppscoth.io/', 'http://localhst:3000'],
    // credentials: true,
  });
  // app.useGlobalInterceptors(new TimeoutInterceptor());
  const dataSource = app.get(DataSource);
  console.log('DataSource is initialized:', dataSource.isInitialized);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
