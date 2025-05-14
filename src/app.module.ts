import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './domains/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthMiddleware } from './middlewares/auth/auth.middleware';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { AuthModule } from './domains/auth/auth.module';
import { ProductModule } from './domains/product/product.module';
import { CategoryModule } from './domains/category/category.module';
import { CaslModule } from './modules/casl/casl.module';
import { initializeApp } from 'firebase-admin/app';
import { credential } from 'firebase-admin';
import { CacheModule } from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      envFilePath: ['.env'],
    }),

    // cach 1 -> domain
    // cach 2 -> featured

    // ElasticsearchModule.registerAsync({
    //   inject: [ConfigService],
    //   useFactory: async (configService: ConfigService) => ({
    //     node: configService.get<string>('ELASTICSEARCH_URL'),
    //   })
    // }),

    // cach 2
    // ElasticsearchModule.registerAsync({
    //   useFactory: () => ({
    //     node: configuration().elastic_search.default_node,
    //   })
    // }),


    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: () => {
        return {
          ttl: 5000,
          stores: [
            createKeyv('redis://localhost:6379'),
          ]
        }
      }
    }),

    TypeOrmModule.forRootAsync({
      // ConfigServive
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: 'localhost',
          port: configService.get<number>('DATABASE_PORT'),
          username: configService.get<string>('DATABASE_USERNAME'),
          password: configService.get<string>('DATABASE_PASSWORD'),
          database: configService.get<string>('DATABASE_NAME'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          autoLoadEntities: true,
          synchronize: true,
        };
      }
    }),
    JwtModule,
    UserModule,
    ProductModule,
    CategoryModule,
    AuthModule,
    CaslModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtService,
  ],
})
export class AppModule implements NestModule {

  constructor() {
    const app = initializeApp({
      credential: credential.cert('src/keys/firebase-admin-key.json'),
    });
  }



  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).exclude(
      { path: 'auth/login', method: RequestMethod.ALL },
      { path: 'auth/signup', method: RequestMethod.ALL },
      { path: 'auth/refresh-token', method: RequestMethod.ALL },
    ).forRoutes('*')
  }
}
