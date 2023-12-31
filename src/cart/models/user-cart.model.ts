import { Product } from '@products/models'
import { User } from '@user/models'
import {
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
} from 'sequelize-typescript';
import { v4 } from 'uuid';

@Table({ tableName: 'user_carts', createdAt: false, updatedAt: false })
export class UserCart extends Model<UserCart> {
    @Column({
        type: DataType.UUID,
        defaultValue: () => v4(),
        primaryKey: true,
    })
    id: string;

    @ForeignKey(() => Product)
    @Column({
        type: DataType.STRING,
    })
    productsId: string[];

    @ForeignKey(() => User)
    @Column({
        type: DataType.STRING,
    })
    userId: string;
}
