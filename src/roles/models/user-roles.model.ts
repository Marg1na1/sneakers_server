import {
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
} from 'sequelize-typescript';
import { Roles } from './roles.model';
import { User } from 'src/user/user.model';
import { v4 } from 'uuid';

@Table({ tableName: 'userRoles', createdAt: false, updatedAt: false })
export class UserRoles extends Model<UserRoles> {
    @Column({
        type: DataType.UUID,
        primaryKey: true,
        defaultValue: () => v4(),
    })
    id: string;

    @ForeignKey(() => Roles)
    @Column({ type: DataType.INTEGER })
    roleId: number;

    @ForeignKey(() => User)
    @Column({ type: DataType.UUID })
    userId: string;
}
