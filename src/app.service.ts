import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './models/user.mode';


@Injectable()
export class AppService {
  users: User[] = [
    {
      id: "1",
      name: "Quan",
      gender: "male"
    },
    {
      id: "2",
      name: "Van Teo",
      "gender": null,
    }
  ]

  //GET:all
  getAll(){
    return this.users;
  }

  //GET:id
  getById(id: string){
    const user = this.users.find((user) => user.id === id);

    if(user){
      return user;
    }
    throw new HttpException("Khong tim thay user", HttpStatus.NOT_FOUND)
  }

  // POST
  create(user: User){
    this.users.push(user)
  }

  // PUT
  update(id: string, data: any){
    const index = this.users.findIndex((user) => user.id == id);
    if(index == -1){
      throw new HttpException("Khong tim thay user", HttpStatus.BAD_REQUEST)
    }

    const user = this.users[index];

    this.users[index] = {
    ...user,
    ...data
    }
  }

  // DELETE
  delete(id:string){
    const findUser = this.users.find((user) => user.id == id);
    if(!findUser){
      throw new HttpException("Khong tim thay user", HttpStatus.BAD_REQUEST)
    }

    const index = this.users.indexOf(findUser);
    this.users.splice(index, 1);
    return this.users;
  }

}
