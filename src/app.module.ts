import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './domains/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileModule } from './domains/profile/profile.module';
import { PhotoModule } from './domains/photo/photo.module';
import { CategoryModule } from './domains/category/category.module';
import { AuthMiddleware } from './middlewares/auth/auth.middleware';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration]
    }),
    JwtModule,
    UserModule,
    ProfileModule,
    PhotoModule,
    CategoryModule,
    TypeOrmModule.forRoot({
    type: configuration().database.type as any,
    host: configuration().database.host,
    port: 5432,
    username: configuration().database.username,
    password: configuration().database.password,
    database: configuration().database.database,
    entities: [],
    synchronize: true,
    autoLoadEntities: true,
    logging: true,
    ssl: false,

  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).exclude(
      {path: 'user/login', method: RequestMethod.ALL},
      {path: 'user/signup', method: RequestMethod.ALL},
      {path: 'user/refreshToken', method: RequestMethod.ALL},
    ).forRoutes('*')
  }
}
