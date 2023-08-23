import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { resolve } from 'path';
import { UserModule } from '@user/user.module';
import { AuthModule } from '@auth/auth.module';
import { User } from '@user/models';
import { Roles, UserRoles } from '@roles/models';
import { Token } from '@auth/models';
import { Product } from '@products/models';
import { UserCart } from '@cart/models';
import { ImageFile } from '@files/models';
import { ProductsModule } from '@products/products.module';
import { CartModule } from '@cart/cart.module';
import { AddressModule } from '@address/address.module';
import { OrdersModule } from '@orders/orders.module';
import { RolesModule } from '@roles/roles.module';
import { FilesModule } from '@files/files.module';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { ProductPhoto } from '@products/models/product-photo.model';
import { MailModule } from '@mail/mail.module'

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
            password: `${process.env.POSTGRES_PASSWORD}`,
            database: process.env.POSTGRES_NAME,
            models: [
                User,
                Roles,
                UserRoles,
                Token,
                Product,
                UserCart,
                ImageFile,
                ProductPhoto,
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
