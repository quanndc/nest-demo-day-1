import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UsePipes, ParseIntPipe, Query, ParseArrayPipe, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'express';


@Controller('user')
export class UserController {

  constructor(private userSevice: UserService){}


  @Get()
  findAll(){
    return this.userSevice.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number){
    return this.userSevice.findOne(id);
  }
}
