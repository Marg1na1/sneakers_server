import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './user.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { RolesModule } from 'src/roles/roles.module';
import { UserRoles } from 'src/roles/models/user-roles.model';
import { Roles } from 'src/roles/models/roles.model';
import { AuthModule } from 'src/auth/auth.module';
import { CacheModule } from '@nestjs/cache-manager';

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
