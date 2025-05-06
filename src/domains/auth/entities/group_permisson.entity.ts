import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, ManyToOne } from 'typeorm';
import { Permission } from './permisson.entity';
import { User } from 'src/domains/user/entities/user.entity';


@Entity()
export class GroupPermission{

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        unique: true,
    })
    name: string;

    @ManyToMany(() => User, (user) => user.groupPermissions) 
    @JoinTable()
    user: User[];

    @ManyToMany(() => Permission, (permission) => permission.groupPermissions, {cascade: true})
    @JoinTable()
    permissions: Permission[]
}