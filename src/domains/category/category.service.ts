import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class CategoryService {

  constructor(
    @InjectRepository(Category) private categoryRepository : Repository<Category>,
    @InjectDataSource('default') private  pgDataSource : DataSource,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const data = this.categoryRepository.create(createCategoryDto);
    const result = await this.categoryRepository.save(data);
    console.log(`Category created: ${result}`);
    return result;
  }

  async findAll() {
    const data = await this.categoryRepository.find({
    });
    return data;
  }

  findOne(id: number) {
    const data = this.categoryRepository.findOneBy({ id });
    if (!data) {
      throw new HttpException('Category not found', HttpStatus.BAD_REQUEST);
    }
    return data;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const data = this.categoryRepository.findOneBy({ id });
    if (!data) {
      throw new HttpException('Category not found', HttpStatus.BAD_REQUEST);
    }
    
    const result = this.categoryRepository.update(id, updateCategoryDto);
    return result;
  }

  remove(id: number) {
    const data = this.categoryRepository.findOneBy({ id });
    if (!data) {
      throw new HttpException('Category not found', HttpStatus.BAD_REQUEST);
    }
    const result = this.categoryRepository.delete(id);
    return result;
  }
}
