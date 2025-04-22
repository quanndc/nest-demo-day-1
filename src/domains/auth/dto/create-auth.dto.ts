import { PickType } from "@nestjs/mapped-types";
import { Auth } from "../entities/auth.entity";

export class CreateAuthDto extends 
PickType(Auth, ['email','password'] as const){}
