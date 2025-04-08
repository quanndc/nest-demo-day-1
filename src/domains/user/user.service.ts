import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private usersRepository : Repository<User>,
  ) {}

  // FIND ALL
  async findAll() {
    return await this.usersRepository.query('CALL say_hello()');
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
