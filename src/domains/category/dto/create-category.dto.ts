import { PickType } from "@nestjs/mapped-types";
import { Category } from "../entities/category.entity";

export class CreateCategoryDto extends PickType(Category, ['name'] as const){}
