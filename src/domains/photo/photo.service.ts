import { Injectable } from '@nestjs/common';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Photo } from './entities/photo.entity';

@Injectable()
export class PhotoService {

  constructor(
    @InjectRepository(Photo)
    private photoRepository : Repository<Photo>,
  ) {}

  create(createPhotoDto: CreatePhotoDto) {
    return 'This action adds a new photo';
  }

  async findAll() {
    return await this.photoRepository.find({
      relations: {
        categories: true,
      }
    })
  }

  findOne(id: number) {
    return `This action returns a #${id} photo`;
  }

  update(id: number, updatePhotoDto: UpdatePhotoDto) {
    return `This action updates a #${id} photo`;
  }

  remove(id: number) {
    return `This action removes a #${id} photo`;
  }
}
