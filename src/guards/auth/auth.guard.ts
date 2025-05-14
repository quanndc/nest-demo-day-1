import { CanActivate, ExecutionContext, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { matchRoles, Permissions } from 'src/decorators/permissions.decorator';
import * as JWT from '../../utils/token/extractToken.util'
import configuration from 'src/config/configuration';
import * as ROLE_UTILS from 'src/utils/role/role.utils'
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private jwtService: JwtService, 
    private reflector: Reflector,
  @InjectDataSource('default') private datasource: DataSource) {}


  async canActivate(context: ExecutionContext) {

    // get roles from request
    const roles = this.reflector.get<string[]>(Permissions, context.getHandler());
    if(!roles){
      return true;
    }

    // get request from context
    const request = context.switchToHttp().getRequest();
    const token = JWT.extractTokenFromHeader(request);
    if(!token){
      // cach 1
      // return false;
      // cach 2
      throw new HttpException('Token not found in guard', HttpStatus.UNAUTHORIZED);
    }

    try{
      const decodedToken = this.jwtService.verify(token, {
        secret: configuration().jwt.secretAccessToken
      })
      // console.log(decodedToken);
      // get role from user
      let userRoles = decodedToken['permissions']
      userRoles = userRoles.map((role: any) => {
        return role['name']
      })
      console.log(userRoles);
      const isMatch = matchRoles(userRoles, roles);
      if(!isMatch){
        throw new HttpException('Permission denied', HttpStatus.FORBIDDEN);
      }
      return isMatch;

    }catch(e){
      if(e instanceof HttpException){
        throw e;
      }
      switch(e.name){
        case 'TokenExpiredError':
          throw new HttpException('Token expired', HttpStatus.UNAUTHORIZED);
        case 'JsonWebTokenError':
          throw new HttpException('Token is invalid', HttpStatus.UNAUTHORIZED);
        default:
          throw new HttpException('Token is invalid', HttpStatus.UNAUTHORIZED);
      }
    }
  }
}
