import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Auth } from './entities/auth.entity';
import * as bcrypt from 'bcrypt';
import configuration from 'src/config/configuration';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth) private authRepo: Repository<Auth>,
    private jwtService: JwtService,
    @InjectDataSource('default') private dataSource: DataSource,
    private userService: UserService
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

    const user = {...await this.userService.getUserAndRoles(isExist.user.id)}
    console.log(user);


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

  // private async getUserRoles(dbUser: string): Promise<string[]> {
  //   const result = await this.dataSource.query(`
  //     SELECT rolname
  //     FROM pg_roles
  //     WHERE oid IN (
  //       SELECT roleid
  //       FROM pg_auth_members
  //       WHERE member = (
  //         SELECT oid FROM pg_roles WHERE rolname = $1
  //       )
  //     )
  //   `, [dbUser]);

  //   return result.map(r => r.rolname);
  // }

  // async getPrivilegesByTable(dbUser: string, tables: string[]): Promise<Record<string, string[]>> {
  //   const actions = ['SELECT', 'INSERT', 'UPDATE', 'DELETE'];
  //   const result: Record<string, string[]> = {};

  //   for (const table of tables) {
  //     result[table] = [];

  //     for (const action of actions) {
  //       const res = await this.dataSource.query(
  //         `SELECT has_table_privilege($1, $2, $3) AS allowed`,
  //         [dbUser, `public.${table}`, action]
  //       );

  //       if (res[0].allowed) result[table].push(action);
  //     }
  //   }

  //   return result;
  // }
}
