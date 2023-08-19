import {
    BelongsToMany,
    Column,
    DataType,
    Model,
    Table,
} from 'sequelize-typescript';
import { User } from 'src/user/user.model';
import { UserRoles } from './user-roles.model';

interface RolesCreationAttrs {
    roleName: string;
    description: string;
}

@Table({ tableName: 'roles' })
export class Roles extends Model<Roles, RolesCreationAttrs> {
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number; 

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
