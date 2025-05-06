import { Controller,Post, Body, HttpCode, Inject, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { CACHE_MANAGER, CacheInterceptor } from '@nestjs/cache-manager';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUp(@Body() CreateAuthDto: CreateAuthDto){
    return this.authService.signUp(CreateAuthDto);
  }

  @HttpCode(200)
  @Post('login')
  signIn(@Body() CreateAuthDto: CreateAuthDto){
    return this.authService.signIn(CreateAuthDto);
  }
}
