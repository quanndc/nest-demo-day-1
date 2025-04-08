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
    firstName: string;
  
    @Column({
        type: 'text',
        nullable: true
    })
    lastName: string;

    @OneToOne(() => Profile, (profile) => profile.user)
    @JoinColumn()
    profile: Profile;

    @OneToMany(() => Photo, (photo) => photo.user)
    photos: Photo[];
}
