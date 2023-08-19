import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { v4 } from 'uuid';

interface ImageReationAttr {
    filename: string;
    originalName: string;
    size: number;
    mimetype: string;
    userId: string;
}

@Table({ tableName: 'images' })
export class ImageFile extends Model<ImageFile, ImageReationAttr> {
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
    })
    mimetype: string;

    @Column({
        type: DataType.STRING,
    })
    userId: string;
}
