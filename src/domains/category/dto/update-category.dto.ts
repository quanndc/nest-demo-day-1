import { PartialType, PickType } from '@nestjs/mapped-types';
import { Category } from '../entities/category.entity';

export class UpdateCategoryDto extends PartialType(Category) {}
