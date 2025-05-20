import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { SearchProductService } from './search_product.service';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import Sql from '@elastic/elasticsearch/lib/api/api/sql';
import { ApiBearerAuth, ApiBody, ApiExcludeController, ApiExcludeEndpoint, ApiForbiddenResponse, ApiOperation, ApiParam, ApiResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Controller('product')
// @ApiExcludeController(true)
@ApiBearerAuth('access-token')
export class ProductController {
  constructor(private readonly productService: ProductService,
    private readonly searchProductService: SearchProductService,
  ) { }

  @Post()  
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get('search/:index')
  search(@Param('index') index: string, @Query('q') query: string) {
    return this.searchProductService.searchDocument(index, query);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all products',
    description: 'Returns a list of all products',
  })
  @ApiResponse({
    status: 200,
    type: CreateProductDto,
    description: 'List of products',
    example: [
      {
        id: 1,
        name: 'Product 1',
        description: 'Description of Product 1',
        price: 100,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      }
    ]
  })
  @ApiUnauthorizedResponse({
    description: "Lack of JWT token in headers",
    example: {
      statusCode: 401,
      message: 'Unauthorized',
      error: 'Unauthorized',
    }
  })
  @ApiForbiddenResponse({
    description: "This route only accepts admin role",
    example: {
      statusCode: 403,
      message: 'Forbidden',
      error: 'Forbidden',
    }
  })
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get product by id',
    description: 'Returns a product by id',
  })
  @ApiResponse({
    status: 200,
    type: CreateProductDto,
    description: 'Product',
    example: {
      id: 1,
      name: 'Product 1',
      description: 'Description of Product 1',
      price: 100,
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
    }
  })

  @ApiParam({
    name: "id",
    description: "Id must be a number, this is the id of the product",
    type: Number,
    example: 1,
  })
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }


  @MessagePattern('index_product')
  async handleMessage(@Payload() payload: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      switch (payload.action) {
        case 'index_product':
          // this.logger.log(`Processing index_product: ${JSON.stringify(payload)}`);
          const result = await this.searchProductService.indexDocument(payload.index, payload.document);
          channel.ack(originalMsg); // Acknowledge on success
          return result;
        default:
          // this.logger.warn(`Unknown action: ${payload.action}`);
          channel.ack(originalMsg); // Acknowledge to avoid hanging, but log warning
          return null;
      }
    } catch (error) {
      // this.logger.error(`Error processing message: ${error.message}`);
      channel.nack(originalMsg, false, false); // Reject without requeue on error
      console.log(error); // Re-throw to let NestJS handle error logging/response
    }
  }
}



