import { Controller,Post, Body, HttpCode, Inject, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { ApiBadRequestResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { access } from 'fs';
import { LoginResponseDto } from './dto/login-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUp(@Body() CreateAuthDto: CreateAuthDto){
    return this.authService.signUp(CreateAuthDto);
  }

  @HttpCode(200)
  @ApiOperation({
    summary: 'Login with email and password',
    description: 'Returns access token and refresh token',
  })
  @ApiResponse({
    status: 200,
    description: 'Login successfuly',
    type: LoginResponseDto,
    example: {
      accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30",
      refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30"
    }
  })

  @ApiBadRequestResponse({
    description: 'Email or password is not valid',
    example: {
      statusCode: 400,
      message: 'Email must be a valid email',
      error: 'Email is not valid',
    }
  })

  @Post('login')
  signIn(@Body() CreateAuthDto: CreateAuthDto){
    return this.authService.signIn(CreateAuthDto);
  }
}
