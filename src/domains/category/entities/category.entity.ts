import { Photo } from "src/domains/photo/entities/photo.entity"
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm"

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @ManyToMany(() => Photo, (photo) => photo.categories)
    photos: Photo[]
}