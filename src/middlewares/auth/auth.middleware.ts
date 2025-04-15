import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import configuration from 'src/config/configuration';
import * as JWT from '../../utils/token/extractToken.util';
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}
  use(req: Request, res: Response, next: () => void) {
    // get token from cookie
    // const token = req.cookies['accessToken'] || "";

    // get token from header
    const token = JWT.extractTokenFromHeader(req);

    if(!token) {
      throw new HttpException('Token not found', HttpStatus.UNAUTHORIZED);
    }
  
    try{
      const decodedToken = this.jwtService.verify(token, {
        secret: configuration().jwt.secretAccessToken,
      })
    }catch(e){
      throw new HttpException('Token is invalid', HttpStatus.UNAUTHORIZED);
    }finally{
      next();
    }
  }
}
