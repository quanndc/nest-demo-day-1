import { MessagePattern, Payload } from "@nestjs/microservices";
import { SearchProductService } from "./search_product.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ProductConsumer {
    constructor(private searchProductService: SearchProductService) {}

    @MessagePattern('index_product')
    async indexProduct(@Payload() payload: any) {
        console.log('Received message:', payload);
        await this.searchProductService.indexDocument('products', payload)
    }
}