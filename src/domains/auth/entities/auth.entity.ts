import { IsEmail, IsNotEmpty } from 'class-validator';
import { User } from 'src/domains/user/entities/user.entity';
import {Entity, PrimaryGeneratedColumn, Column, OneToOne} from 'typeorm';

@Entity()
export class Auth {
    @PrimaryGeneratedColumn()
    id: number;
    // regex
    @IsEmail()
    @IsNotEmpty()
    @Column({ unique: true })
    email: string;
    
    @IsNotEmpty()
    @Column()
    password: string;

    @OneToOne(() => User, (user) => user.auth)
    user: User;
}
