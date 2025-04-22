import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import configuration from 'src/config/configuration';
import { Request } from 'express';
import * as JWT from '../../utils/token/extractToken.util';
import { Cron } from '@nestjs/schedule';
@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User) private usersRepository : Repository<User>,
    @InjectDataSource('default') private PostgresDataSource: DataSource,
    private jwtService: JwtService
  ) {}

  login(){
    const payload = {name: 'quan', role: ['user'], imgURL: ""}

    const token = configuration().jwt.secretAccessToken
    console.log(typeof token);

    const accessToken = this.jwtService.sign(payload, {
      secret: configuration().jwt.secretAccessToken,
      expiresIn: configuration().jwt.secretAccessTokenExpireIn
    })

    const refreshToken = this.jwtService.sign(payload, {
      secret: configuration().jwt.secretRefreshToken,
      expiresIn: configuration().jwt.secretRefreshTokenExpireIn
    })

    return {accessToken, refreshToken}
  }

  refreshToken(req: Request){
  
    const refreshToken = JWT.extractTokenFromHeader(req) as string;

    if(!refreshToken) {
      throw new HttpException('Token not found', HttpStatus.UNAUTHORIZED);
    }

    try{
      const decodedRefreshToken = this.jwtService.verify(refreshToken, {
        secret: configuration().jwt.secretRefreshToken,
      })
      console.log(decodedRefreshToken);

      delete decodedRefreshToken.iat;
      delete decodedRefreshToken.exp;

      console.log(decodedRefreshToken);
      const newAccessToken = this.jwtService.sign(decodedRefreshToken, {
        secret: configuration().jwt.secretAccessToken,
        expiresIn: configuration().jwt.secretAccessTokenExpireIn
      })
      return {newAccessToken}

    }catch(e){
      throw new HttpException('Token is invalid', HttpStatus.UNAUTHORIZED);
    }
  }

  // FIND ALL
  async findAll() {
    // return "findAll";
    const queryRunner = this.PostgresDataSource.createQueryRunner();
    await queryRunner.connect();
    // await queryRunner.startTransaction();

    try{
      const data = await queryRunner.query(`CALL change_car_name(${2})`);
      console.log(data);
      // await queryRunner.commitTransaction();
      return data;
    }catch(e){
      // await queryRunner.rollbackTransaction();
      console.log(e);
      throw new HttpException('Error', HttpStatus.BAD_REQUEST);
    }finally{
      await queryRunner.release();
    }

    // const queryRunner = PostgresDataSource.createQueryRunner();

    // await queryRunner.connect();

    // const data = await queryRunner.query(`SELECT * FROM get_car()`);

    // console.log(data);

    // queryRunner.release();

    // return data;
    // return await this.usersRepository.query('CALL say_hello()');
    // return this.usersRepository.find({
    //   relations: {
    //     profile: true,
    //     photos: true,
    //   },
    //   select: {
    //     photos: {
    //       url: true,
    //     }
    //   }
    // });
  }
  // @Cron('* * * * * *')
  // handleCron() {
  //   console.log('Called when the current second is 45');
  // }

  // FIND BY ID
  findOne(id: number){
    return "findOne";
  }

  // FIND ONE BY EMAIL
  async findOneByEmail(email: string) {
    const user = await this.usersRepository.findOne({
      where: { email },
    })
    return user;
  }

  // CREATE
  async create(user: CreateUserDto) {
    return this.usersRepository.save(user);
  }
  // UPDATE

  async update(id: number, user: User) {
    const existingUser = await this.findOne(id);
    if (!existingUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    // return this.usersRepository.save({ ...existingUser, ...user });
  }

  // DELETE
  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return this.usersRepository.delete(id);
  }
  
}
