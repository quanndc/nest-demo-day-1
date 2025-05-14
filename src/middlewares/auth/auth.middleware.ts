import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import configuration from 'src/config/configuration';
import * as JWT from '../../utils/token/extractToken.util';

import * as admin from 'firebase-admin';


@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}
  
  async use(req: Request, res: Response, next: () => void) {
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
      // const decodedToken = await admin.auth().verifyIdToken(token)

      // decodedToken['iat'] = 0
      // decodedToken['exp'] = 0
      
      // const customToken = await admin.auth().createCustomToken('EDejmtwz5iOLEU5xIzg9TkM2b7f1', {
      //   user: decodedToken,
      //   permissions: ['get user by id']
      // })
      // console.log(customToken);


      if(decodedToken){
        req['user'] = decodedToken;
        next();
      }
    }catch(e){
      throw new HttpException(e.message, HttpStatus.UNAUTHORIZED);
    }
  }
}
