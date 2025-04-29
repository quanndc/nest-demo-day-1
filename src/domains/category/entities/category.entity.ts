import { IsBoolean, IsNotEmpty } from "class-validator"
import { Product } from "src/domains/product/entities/product.entity"
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, CreateDateColumn, UpdateDateColumn } from "typeorm"

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id: number

    @IsNotEmpty()
    @Column()
    name: string

    @CreateDateColumn({
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date

    @UpdateDateColumn({
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
    })
    updatedAt: Date

    @IsBoolean()
    @Column({
        default: true,
    })
    isActive: boolean;

    @ManyToMany(() => Product, (product) => product.categories)
    products: Product[]
}