import { PickType } from "@nestjs/mapped-types";
import { Auth } from "../entities/auth.entity";
import { ApiProperty } from "@nestjs/swagger";

export class CreateAuthDto extends 
PickType(Auth, ['email','password'] as const){

    @ApiProperty({
        description: 'User email',
        example: "user1@gmail.com"
    })
    email: string;
    
    @ApiProperty({
        description: 'Password must be provided',
        example: '123456'
    })
    password: string;
}
