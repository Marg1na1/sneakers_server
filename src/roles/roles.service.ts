import { Injectable } from '@nestjs/common';
import { CreteRolesDto } from './dto/create-roles.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Roles } from './models/roles.model';

@Injectable()
export class RolesService {
    constructor(@InjectModel(Roles) private rolesRepository: typeof Roles) {}

    async createRole(dto: CreteRolesDto) {
        const role = await this.rolesRepository.create(dto);
        return role;
    }

    async getRoleByName(name: string) {
        const role = await this.rolesRepository.findOne({
            where: { roleName: name },
        });

        return role;
    }
}
