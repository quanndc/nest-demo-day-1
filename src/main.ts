import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

import { DataSource } from 'typeorm';
import { Transport } from '@nestjs/microservices';

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

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'myqueue',
      queueOptions: {
        durable: false,
      },
    }
  });

  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
