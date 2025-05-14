import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { SearchProductService } from './search_product.service';
import { ElasticsearchModule, ElasticsearchService } from '@nestjs/elasticsearch';
import configuration from 'src/config/configuration';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), ElasticsearchModule.register({
    nodes: ['http://localhost:9200'],
  })],
  controllers: [ProductController],
  providers: [ProductService, SearchProductService],
})
export class ProductModule {}
