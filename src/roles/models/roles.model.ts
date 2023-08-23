import {
    BelongsToMany,
    Column,
    DataType,
    Model,
    Table,
} from 'sequelize-typescript';
import { UserRoles } from './user-roles.model';
import { User } from '@user/models';
import { v4 } from 'uuid';

interface RolesCreationAttrs {
    roleName: string;
    description: string;
}

@Table({ tableName: 'roles' })
export class Roles extends Model<Roles, RolesCreationAttrs> {
    @Column({
        type: DataType.STRING,
        defaultValue: () => v4(),
        primaryKey: true,
    })
    id: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    })
    roleName: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    description: string;

    @BelongsToMany(() => User, () => UserRoles)
    users: User[];
}
