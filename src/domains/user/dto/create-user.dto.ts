import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { User } from '../entities/user.entity';
import { PartialType } from '@nestjs/mapped-types';

export class CreateUserDto extends PartialType(User) {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;
}
