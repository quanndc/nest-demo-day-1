import { Auth } from 'src/domains/auth/entities/auth.entity';
import { Photo } from 'src/domains/photo/entities/photo.entity';
import { Profile } from 'src/domains/profile/entities/profile.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity()
export class User {
    //uuid
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
    })
    dob: Date;

    @Column({
        type: 'text',
        nullable: true,
    })
    email: string

    @Column({
        type: 'text',
        nullable: true,
    })
    firstName: string;
  
    @Column({
        type: 'text',
        nullable: true
    })
    lastName: string;

    @OneToOne(() => Auth, (auth) => auth.user, {cascade: true})
    @JoinColumn()
    auth: Auth
}