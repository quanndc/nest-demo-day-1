import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { PostgresDataSource } from 'src/datasources/postgres.datasource';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private usersRepository : Repository<User>,
    private jwtService: JwtService
  ) {}

  login(){
    const payload = {name: 'quan', role: 'student', imgURL: ""}
    const accessToken = this.jwtService.sign(payload, {
      secret: "123456",
      expiresIn: '1h'
    })
    return accessToken;
  }
  // FIND ALL
  async findAll() {
    
    return "findAll";

    // const queryRunner = PostgresDataSource.createQueryRunner();
    // await queryRunner.connect();
    // await queryRunner.startTransaction();

    // try{
    //   const data = await queryRunner.query(`CALL change_car_name($1)`, [3]);
    //   console.log(data);
    //   await queryRunner.commitTransaction();
    //   return data;
    // }catch(e){
    //   await queryRunner.rollbackTransaction();
    //   console.log(e);
    //   throw new HttpException('Error', HttpStatus.BAD_REQUEST);
    // }finally{
    //   await queryRunner.release();
    // }

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

  // FIND BY ID
  findOne(id: number){
    return this.usersRepository.findOneBy({ id})
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
    return this.usersRepository.save({ ...existingUser, ...user });
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
