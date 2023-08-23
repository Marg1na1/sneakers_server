import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserCart } from './models'
import { UserModule } from '@user/user.module'
import { ProductsModule } from '@products/products.module'

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
