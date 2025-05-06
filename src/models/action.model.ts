import { Category } from "src/domains/category/entities/category.entity";
import { Product } from "src/domains/product/entities/product.entity";
import { User } from "src/domains/user/entities/user.entity";

export interface ActionModel {
    action: string;
    subject: string | 'all';
    fields?: [key: number, value: string][];
};
