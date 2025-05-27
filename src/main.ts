import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

import { DataSource } from 'typeorm';
import { Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TimeoutInterceptor } from './interceptors/timeout/timeout.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors();
  // app.useGlobalInterceptors(new TimeoutInterceptor());
  const dataSource = app.get(DataSource);
  console.log('DataSource is initialized:', dataSource.isInitialized);
  app.useGlobalPipes(new ValidationPipe());

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      noAck: false,
      urls: ['amqp://guest:guest@localhost:5672'],
      queue: 'myqueue',
      queueOptions: {
        durable: false,
      },
    }
  });
  

    const config = new DocumentBuilder()
    .setTitle('UI For Testing My API')
    .setDescription('The API description')
    .setVersion('1.0')
    .addTag('API').addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in: 'header',
      name: 'Authorization',
    }, "access-token")
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('index', app, documentFactory);


  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
