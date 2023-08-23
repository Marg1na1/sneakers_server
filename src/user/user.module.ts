import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { CacheModule } from '@nestjs/cache-manager';
import { User } from './models';
import { RolesModule } from '@roles/roles.module';
import { Roles, UserRoles } from '@roles/models';
import { AuthModule } from '@auth/auth.module';

@Module({
    controllers: [UserController],
    providers: [UserService],
    imports: [
        SequelizeModule.forFeature([User, Roles, UserRoles]),
        RolesModule,
        AuthModule,
        CacheModule.register(),
    ],
    exports: [UserService],
})
export class UserModule {}
