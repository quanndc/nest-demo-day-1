import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auth } from './entities/auth.entity';
import * as bcrypt from 'bcrypt';
import configuration from 'src/config/configuration';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth) private authRepo: Repository<Auth>,
    private jwtService: JwtService,
  ) {
  }
  async signUp(createAuthDto: CreateAuthDto) {
    //Use Function
    //Use procedure
    // use Repo
    const { email, password } = createAuthDto;
    console.log(email, password);
    const isExist = await this.authRepo.findOne({ where: { email } });
    if (isExist) {
      throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
    }

    const saltOrRounds = 10;
    const hashPassword = await bcrypt.hash(password, saltOrRounds);

    const newAuth = this.authRepo.create({
      email,
      password: hashPassword,
    })
    return await this.authRepo.save(newAuth);
  }

  async signIn(createAuthDto: CreateAuthDto) {

    const { email, password } = createAuthDto;
    // console.log(email, password);
    // tuy chon
    // if(!email || !password){
    //   throw new HttpException('Email or password can be empty', HttpStatus.BAD_REQUEST);
    // }

    const isExist = await this.authRepo.findOne(
      {
        where: { email },
        relations: ['user']
      });

    if (!isExist) {
      throw new HttpException('Email not found', HttpStatus.BAD_REQUEST);
    }

    const isMatch = await bcrypt.compare(password, isExist.password);
    if (!isMatch) {
      throw new HttpException('Wrong password', HttpStatus.BAD_REQUEST);
    }

    const user = { ...isExist.user };

    const token = configuration().jwt.secretAccessToken
    console.log(typeof token);

    const accessToken = this.jwtService.sign(user, {
      secret: configuration().jwt.secretAccessToken,
      expiresIn: configuration().jwt.secretAccessTokenExpireIn
    })

    const refreshToken = this.jwtService.sign(user, {
      secret: configuration().jwt.secretRefreshToken,
      expiresIn: configuration().jwt.secretRefreshTokenExpireIn
    })

    return { accessToken, refreshToken }
  }
}
