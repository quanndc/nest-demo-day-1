import { HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import configuration from 'src/config/configuration';
import { Request } from 'express';
import * as JWT from '../../utils/token/extractToken.util';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User) private usersRepository : Repository<User>,
    @InjectDataSource('default') private PostgresDataSource: DataSource,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}


  async getUserAndRoles(userId: number) {
    const data = await this.usersRepository.findOne({
      where: {
        id: userId,
      },
      relations: {
        groupPermissions: {
          permissions: true,
        },
      },
    });
  
    if (!data) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  
    // Map the data to include user details and flatten permissions
    const mappedData = {
      id: data.id,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      permissions: data.groupPermissions.flatMap((group) =>
        group.permissions.map((permission) => ({
          id: permission.id,
          name: permission.name,
        }))
      ),
    };
    return mappedData;
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

    const cacheData = await this.cacheManager.get('users')
    if(cacheData){
      console.log('Cache hit');
      return cacheData;
    }

    const data = await this.usersRepository.find();
    this.cacheManager.set('users', data, 10000000)
    return data;
  }
  // @Cron('* * * * * *')
  // handleCron() {
  //   console.log('Called when the current second is 45');
  // }

  // FIND BY ID
  async findOne(id: number){
    const data = await this.usersRepository.findOne({
      where: { id }
    })
    return data;
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


  async fineOne(id: number){
    const data = await this.usersRepository.findOne({
      where: {
        id: id
      }
    })
  }
  
}
