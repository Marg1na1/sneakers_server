import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { UserModule } from 'src/user/user.module';
import { ProductsModule } from 'src/products/products.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserCart } from './models/user-cart.model';

@Module({
    controllers: [CartController],
    providers: [CartService],
    imports: [
        SequelizeModule.forFeature([UserCart]),
        UserModule,
        ProductsModule,
    ],
})
export class CartModule {}
