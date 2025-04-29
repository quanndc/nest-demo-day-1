import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { CaslAbilityFactory } from 'src/modules/casl/casl-ability/casl-ability.factory';

@Module({
  imports: [JwtModule,TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, CaslAbilityFactory],
})
export class UserModule {}
