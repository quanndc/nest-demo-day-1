import { Category } from "src/domains/category/entities/category.entity";
import { User } from "src/domains/user/entities/user.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from "typeorm";

@Entity()
export class Photo {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    url: string;

    @ManyToOne(() => User, (user) => user.photos, { cascade: true })
    user: User;

    @ManyToMany(() => Category, (category) => category.photos, { cascade: true })
    @JoinTable()
    categories: Category[];
}
