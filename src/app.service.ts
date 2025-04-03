import { HttpException, HttpStatus, Injectable, Scope } from '@nestjs/common';
import { User } from './models/user.model';

@Injectable({scope: Scope.DEFAULT})
export class AppService {
  
}
