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
    private userService: UserService,
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

    // await admin.auth().updateUser("obcB3M4Q1fSxZ0AI8me2NMGNJoe2", {
    //   disabled: true
    // })
    // console.log(email, password);
    // tuy chon
    // if(!email || !password){
    //   throw new HttpException('Email or password can be empty', HttpStatus.BAD_REQUEST);
    // }
    // const data = await admin.auth().verifyIdToken('eyJhbGciOiJSUzI1NiIsImtpZCI6IjNmOWEwNTBkYzRhZTgyOGMyODcxYzMyNTYzYzk5ZDUwMjc3ODRiZTUiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiTWluaCBRdcOibiBUcuG6p24iLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jSjZpYmQxNnluc0E3Z0o0VVFLcnUxSW5hUU44R3poSFEzR0VKd1prT0hoM3AzYzV3PXM5Ni1jIiwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL2Zpci1sb2dpbi13IiwiYXVkIjoiZmlyLWxvZ2luLXciLCJhdXRoX3RpbWUiOjE3NDY2OTU0MjMsInVzZXJfaWQiOiJvYmNCM000UTFmU3haMEFJOG1lMk5NR05Kb2UyIiwic3ViIjoib2JjQjNNNFExZlN4WjBBSThtZTJOTUdOSm9lMiIsImlhdCI6MTc0NjY5NTQyMywiZXhwIjoxNzQ2Njk5MDIzLCJlbWFpbCI6ImdpZGVvbnRtcS5kZXZAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZ29vZ2xlLmNvbSI6WyIxMDMzMDA2MzU0MDkzNTc1MTM1NDAiXSwiZW1haWwiOlsiZ2lkZW9udG1xLmRldkBnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJnb29nbGUuY29tIn19.Kxx1K6N9SXEwBtd1amytqBxmNiP5caZ5zDxoF0Ouk9CQmT9j3zPov18lcUVfCjsHcs_lLBiBG8LA3-xPhVavXP11HdfYIpufLBitCFILMxfsfSguj2ub4joo-5hpTJP1Y8woOaENs5VVrED2wuMWfAxQBCJNE1M6BzbqYWMPe6o9KGcH0zQWi2lxxAr5LXgNSl1eKHq_RrNVxkWMxYIEHeAARsw5gbHVQdu6K5aZkwdr-2jOYeu2P55xtaZgyo9J661BmKWPpPpCEd_wssty9UTQvLL7YoBg1LU2kUbspWYJ1nsevaFpUI_jKVXxNnCdJjYgKEN3AcMJtIO5K_G4yQ')
    // console.log(data);

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
    // console.log(user);


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
