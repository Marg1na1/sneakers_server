import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Roles } from './models'
import { CreteRolesDto } from './dto'

@Injectable()
export class RolesService {
    constructor(@InjectModel(Roles) private rolesRepository: typeof Roles) {}

    async createRole(dto: CreteRolesDto) {
        return await this.rolesRepository.create(dto);
    }

    async getRoleByName(name: string) {
        return await this.rolesRepository.findOne({
            where: { roleName: name },
        });
    }
}
