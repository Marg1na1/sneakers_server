import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { RolesModule } from './roles/roles.module';
import { AddressModule } from './address/address.module';
import { FilesModule } from './files/files.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user/user.model';
import { ConfigModule } from '@nestjs/config';
import { Roles } from './roles/models/roles.model';
import { UserRoles } from './roles/models/user-roles.model';
import { MailModule } from './mail/mail.module';
import { Token } from './auth/models/token.model';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { Product } from './products/models/product.model';
import { UserCart } from './cart/models/user-cart.model';
import { ImageFile } from './files/models/image.model';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join, resolve } from 'path';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: `.${process.env.NODE_ENV}.env`,
            isGlobal: true,
        }),
        ServeStaticModule.forRoot({
            rootPath: resolve(__dirname, '..', 'uploads'),
        }),
        SequelizeModule.forRoot({
            dialect: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: +!process.env.POSTGRES_PORT,
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_NAME,
            models: [
                User,
                Roles,
                UserRoles,
                Token,
                Product,
                UserCart,
                ImageFile,
            ],
            autoLoadModels: true,
            logging: true,
        }),
        ProductsModule,
        CartModule,
        AddressModule,
        OrdersModule,
        UserModule,
        RolesModule,
        AuthModule,
        FilesModule,
        MailModule,
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
    ],
})
export class AppModule {}
