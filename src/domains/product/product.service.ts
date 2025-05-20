import { Inject, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { SearchProductService } from './search_product.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ProductService {

  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @Inject('APP_SERVICE') private readonly client: ClientProxy,
  ) {}



  async create(createProductDto: CreateProductDto) {
    const product = this.productRepository.create(createProductDto)

    await this.productRepository.save(product)

    this.client.send('index_product', {
      action: 'index_product',
      index: 'products',
      document: product
    }).subscribe({})
    

    return product;
  }

  
  findAll() {
    return `This action returns all product`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }


  handleEvent(payload: any) {
    
  }
}
