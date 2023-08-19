import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
} from 'sequelize-typescript';
import { User } from 'src/user/user.model';

interface TokenReationAttr {
    userId: string;
    token: string;
    exp: Date;
    agent: string;
}

@Table({ tableName: 'tokens' })
export class Token extends Model<Token, TokenReationAttr> {
    //TODO везде айдишники сделать uuid 
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
    })
    id: number;

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
