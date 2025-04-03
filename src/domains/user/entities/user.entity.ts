
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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
}
