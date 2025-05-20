import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsNumber, IsString, Length, Max, min, Min } from "class-validator";
import { Category } from "src/domains/category/entities/category.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, UpdateDateColumn, CreateDateColumn } from "typeorm";

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @IsNotEmpty()
    @Length(10, 100)
    @Column()
    name: string;

    @Column()
    description: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(1000)
    @Max(100000000)
    @Column()
    price: number;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    @Max(10000)
    @Column()
    remaining: number;


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

    @IsNotEmpty()
    @IsString({
        each: true,
    })
    @Column({
        type: 'text',
        array: true,
        default: []
    })
    images: string[];

    @ManyToMany(() => Category, (category) => category.products, { cascade: true })
    @JoinTable()
    categories: Category[];
}
