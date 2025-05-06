import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from './entities/auth.entity';
import { JwtModule } from '@nestjs/jwt';
import { GroupPermission } from './entities/group_permisson.entity';
import { Permission } from './entities/permisson.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule, JwtModule,TypeOrmModule.forFeature([Auth, GroupPermission, Permission])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
