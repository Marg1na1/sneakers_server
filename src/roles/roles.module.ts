import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Roles, UserRoles } from './models'
import { User } from '@user/models'
import { AuthModule } from '@auth/auth.module'

@Module({
    providers: [RolesService],
    controllers: [RolesController],
    imports: [
        SequelizeModule.forFeature([Roles, User, UserRoles]),
        AuthModule,
    ],
    exports: [RolesService],
})
export class RolesModule {}
