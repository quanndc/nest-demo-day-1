import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './domains/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileModule } from './domains/profile/profile.module';
import { PhotoModule } from './domains/photo/photo.module';
import { CategoryModule } from './domains/category/category.module';

@Module({
  imports: [UserModule,ProfileModule,PhotoModule,CategoryModule, TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'admin',
    password: 'admin',
    database: 'my_db',
    entities: [],
    synchronize: true,
    autoLoadEntities: true,
    logging: true,
    ssl: false,
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
