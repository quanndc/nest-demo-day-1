import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { GroupPermission } from './group_permisson.entity';


@Entity()
export class Permission{

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        unique: true,
    })
    name: string;

    @ManyToMany(() => GroupPermission, (groupPermission) => groupPermission.permissions)
    groupPermissions: GroupPermission[]

}