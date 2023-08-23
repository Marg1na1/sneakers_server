import {
    BelongsTo,
    BelongsToMany,
    Column,
    DataType,
    ForeignKey,
    HasMany,
    Model,
    Table,
} from 'sequelize-typescript';
import { v4 } from 'uuid';
import { ProductPhoto } from './product-photo.model';
import { User } from '@user/models'
import { UserCart } from '@cart/models'

interface ProductCreationAttrs {
    title: string;
    description: string;
    price: number;
}

@Table({ tableName: 'products' })
export class Product extends Model<Product, ProductCreationAttrs> {
    @Column({
        type: DataType.STRING,
        defaultValue: () => v4(),
        primaryKey: true,
    })
    id: string;

    @Column({ type: DataType.STRING, allowNull: false, unique: true })
    title: string;

    @Column({ type: DataType.STRING, allowNull: false })
    description: string;

    @Column({ type: DataType.INTEGER, defaultValue: 1 })
    count: number;

    @Column({ type: DataType.INTEGER, allowNull: false })
    price: number;

    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    isHide: boolean;

    @Column({ type: DataType.INTEGER, defaultValue: 0 })
    discountAmount: number;

    @ForeignKey(() => User)
    @Column({ type: DataType.STRING })
    sellerId: string;

    @HasMany(() => ProductPhoto)
    photos: ProductPhoto[];

    @BelongsTo(() => User)
    user: User;

    @BelongsToMany(() => User, () => UserCart)
    users: User[];
}
