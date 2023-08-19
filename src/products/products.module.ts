import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/user/user.model';
import { Product } from './models';
import { JwtModule } from '@nestjs/jwt';
import { options } from 'src/auth/auth.config'

@Module({
    providers: [ProductsService],
    controllers: [ProductsController],
    imports: [
        SequelizeModule.forFeature([User, Product]),
        JwtModule.registerAsync(options()),
    ],
    exports: [ProductsService, JwtModule],
})
export class ProductsModule {}
