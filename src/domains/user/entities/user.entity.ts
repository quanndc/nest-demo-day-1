import { ApiProperty } from '@nestjs/swagger';
import { Auth } from 'src/domains/auth/entities/auth.entity';
import { GroupPermission } from 'src/domains/auth/entities/group_permisson.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToMany } from 'typeorm';

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

    @ApiProperty({description: 'User email', example: "example@gmai.com"})
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

    // @Exclude()
    @OneToOne(() => Auth, (auth) => auth.user, {cascade: true})
    @JoinColumn()
    auth: Auth

    @ManyToMany(() => GroupPermission, (groupPermission) => groupPermission.user)
    groupPermissions: GroupPermission[]
}