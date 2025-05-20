import { Controller, Get, Post, Param, ParseIntPipe, UseGuards, UploadedFile, UseInterceptors, BadRequestException, ParseFilePipeBuilder, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { Permissions } from 'src/decorators/permissions.decorator';
import { Role } from 'src/enums/role.enum';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileTypeResult, fromBuffer } from 'file-type';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';


@ApiTags('user')
@Controller('user')
export class UserController {

  constructor(private userSevice: UserService) { }

  //accessToken
  //refreshToken -> optional
  // @Throttle({default: { limit: 2, ttl: 60000 }})

  // @Get('refreshToken')
  // refreshToken(@Req() req: Request){
  //   return this.userSevice.refreshToken(req);
  // }

  @Get('roles/:id')
  findAllRoles(@Param('id', ParseIntPipe) id: number) {
    return this.userSevice.getUserAndRoles(id);
  }


  @Get()
  @UseGuards(AuthGuard)
  @Permissions([Role.GET_USER_BY_ID])
  findAll() {
    return this.userSevice.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @Permissions([Role.GET_USER_BY_ID])
  // @Roles([Role.ADMIN])
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userSevice.findOne(id);
  }
}
