import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { SearchProductService } from './search_product.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService {

  constructor(private searchProductService: SearchProductService,
    @InjectRepository(Product) private productRepository: Repository<Product>
  ) {}



  async create(createProductDto: CreateProductDto) {
    const product = this.productRepository.create(createProductDto)

    const index = 'products'

    // const document = {
    //   id: product.id,
    //   name: product.name,
    //   description: product.description,
    // }

    const indexData = await this.searchProductService.indexDocument(index, createProductDto)
    await this.productRepository.save(product)

    return {
      product,
      indexData
    }
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
}
