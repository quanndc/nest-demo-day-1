import { PartialType } from "@nestjs/mapped-types";
import { Product } from "../entities/product.entity";
import { ApiProperty } from "@nestjs/swagger";

export class CreateProductDto extends PartialType(Product) {
    
    @ApiProperty({
        description: 'Product name need to be longer than 10 characters',
        example: 'Product 1 name'
    })
    name?: string;

    @ApiProperty({
        description: 'Product description',
        example: 'Product 1 description'
    })
    description?: string;

    @ApiProperty({
        description: 'Price must be a number and greater than 1000',
        example: 100
    })
    price?: number;
}
