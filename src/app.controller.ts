import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { AppService } from './app.service';
import { User } from './models/user.mode';
@Controller()
export class AppController {


  constructor(public appService: AppService) {}
// RESTful API
// CRUD
// CREATE
// READ
// UPDATE
// DELETE


  @Get()
  getAll() : User[] {
    return this.appService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: string){
    try{
      return this.appService.getById(id)
    } catch(e){
      return e
    }
  }

  @Post()
  create(@Body() user: User){
    return this.appService.create(user)
  }

  @Delete(':id')
  delete(@Param('id') id: string){
    return this.appService.delete(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any){
    return this.appService.update(id, data);
  }
}
