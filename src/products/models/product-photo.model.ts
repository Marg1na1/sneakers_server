import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
} from 'sequelize-typescript';
import { v4 } from 'uuid';
import { Product } from './product.model';

interface ProductPhotoReationAttr {
    filename: string;
    originalName: string;
    size: number;
    mimetype: string;
    productId: string;
}

@Table({ tableName: 'product_photos', createdAt: false, updatedAt: false })
export class ProductPhoto extends Model<ProductPhoto, ProductPhotoReationAttr> {
    @Column({
        type: DataType.STRING,
        primaryKey: true,
        defaultValue: () => v4(),
    })
    id: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    })
    filename: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    originalName: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    size: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    mimetype: string;

    @ForeignKey(() => Product)
    @Column({
        type: DataType.STRING,
    })
    productId: string;

    @BelongsTo(() => Product)
    product: Product;
}
