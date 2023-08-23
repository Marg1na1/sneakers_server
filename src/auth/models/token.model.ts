import { User } from '@user/models';
import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
} from 'sequelize-typescript';
import { v4 } from 'uuid'

interface TokenReationAttr {
    userId: string;
    token: string;
    exp: Date;
    agent: string;
}

@Table({ tableName: 'tokens' })
export class Token extends Model<Token, TokenReationAttr> {
    @Column({
        type: DataType.STRING,
        defaultValue: () => v4()
    })
    id: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        primaryKey: true,
    })
    token: string;

    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    exp: Date;

    @ForeignKey(() => User)
    @Column({
        type: DataType.STRING,
    })
    userId: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    agent: string;

    @BelongsTo(() => User)
    user: User;
}
