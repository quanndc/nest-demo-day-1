import { User } from "src/domains/user/entities/user.entity";
import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from "typeorm";

@Entity()
export class Profile {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    gender: string;

    @Column()
    email: string;

    @OneToOne(() => User, (user) => user.profile)
    user: User;
}
