import { CallHandler, ExecutionContext, Injectable, NestInterceptor, UploadedFile } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class ImageTypeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

    const request = context.switchToHttp().getRequest();
    

    return next.handle();
  }
}
