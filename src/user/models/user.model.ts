import {
    BelongsToMany,
    Column,
    DataType,
    HasMany,
    Model,
    Table,
} from 'sequelize-typescript';
import { v4 } from 'uuid';
import { Providers } from '@enum'
import { Product } from '@products/models'
import { Roles, UserRoles } from '@roles/models'
import { UserCart } from '@cart/models'
import { Token } from '@auth/models'

interface UserReationAttr {
    email: string;
    password?: string;
    userName: string;
    provider?: Providers;
}
@Table({ tableName: 'users' })
export class User extends Model<User, UserReationAttr> {
    @Column({
        type: DataType.STRING,
        defaultValue: v4(),
        primaryKey: true,
    })
    id: string;

    @Column({ type: DataType.STRING, unique: true, allowNull: false })
    email: string;

    @Column({ type: DataType.STRING })
    password: string;

    @Column({ type: DataType.STRING, unique: true, allowNull: true })
    userName: string;

    @Column({ type: DataType.STRING })
    avatar: string;

    @Column({ type: DataType.STRING, allowNull: true })
    provider: Providers;

    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    banned: boolean;

    @Column({ type: DataType.STRING, allowNull: true })
    banReason: string;

    @HasMany(() => Product)
    products: Product[];

    @BelongsToMany(() => Roles, () => UserRoles)
    roles: Roles[];

    @BelongsToMany(() => Product, () => UserCart)
    cart: Product[];
 
    @HasMany(() => Token)
    tokens: Token[];
} 
