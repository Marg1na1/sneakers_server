import { Module, forwardRef } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Product } from './models';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '@user/user.module';
import { options } from '@auth/auth.config';
import { User } from '@user/models';
import { FilesModule } from '@files/files.module';

@Module({
    providers: [ProductsService],
    controllers: [ProductsController],
    imports: [
        forwardRef(() => FilesModule),
        SequelizeModule.forFeature([User, Product]),
        JwtModule.registerAsync(options()),
        UserModule,
    ],
    exports: [ProductsService, JwtModule],
})
export class ProductsModule {}
