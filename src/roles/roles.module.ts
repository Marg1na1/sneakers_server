import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Roles } from './models/roles.model';
import { UserRoles } from './models/user-roles.model';
import { User } from 'src/user/user.model'; 

@Module({
    providers: [RolesService],
    controllers: [RolesController],
    imports: [SequelizeModule.forFeature([Roles, User, UserRoles])],
    exports: [RolesService],
})
export class RolesModule {}
