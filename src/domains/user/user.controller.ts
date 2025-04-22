import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UsePipes, ParseIntPipe, Query, ParseArrayPipe, Res, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Request } from 'express';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { Throttle } from '@nestjs/throttler';


@Controller('user')

export class UserController {

  constructor(private userSevice: UserService){}

//accessToken
//refreshToken -> optional
  // @Throttle({default: { limit: 2, ttl: 60000 }})
  @Post('login')
  login(){
    const data = this.userSevice.login();
    // res.cookie('accessToken', data, {
    //   httpOnly:true
    // })
    // res.status(200).send(data);
    return data;
  }

  @Get('refreshToken')
  refreshToken(@Req() req: Request){
    return this.userSevice.refreshToken(req);
  }

  // @Get()
  // @UseGuards(AuthGuard)
  // @Roles([Role.ADMIN, Role.USER])
  findAll(){
    return this.userSevice.findAll();
  }

  @Get(':id')
  @Roles([Role.ADMIN])
  findOne(@Param('id', ParseIntPipe) id: number){
    return this.userSevice.findOne(id);
  }
}
