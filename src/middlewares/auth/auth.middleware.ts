import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {

  constructor(private jwtService: JwtService) {}

  use(req: Request, res: Response, next: () => void) {

    const token = req.cookies['accessToken'] || "";

    if(!token) {
      throw new HttpException('Token not found', HttpStatus.UNAUTHORIZED);
    }
    
    try{
      const decodedToken = this.jwtService.verify(token, {
        secret: '123456'
      })
      console.log(decodedToken);
    }catch(e){
      throw new HttpException('Token is invalid', HttpStatus.UNAUTHORIZED);
    }finally{
      next();
    }
  }
}
