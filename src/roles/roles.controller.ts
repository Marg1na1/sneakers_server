import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreteRolesDto } from './dto/create-roles.dto';
import { RolesService } from './roles.service';
import { Public } from '@shared/decorators'

@Controller('roles')
export class RolesController {
    constructor(private roleService: RolesService) {}

    @Public()
    @Post()
    create(@Body() dto: CreteRolesDto) {
        return this.roleService.createRole(dto);
    }

    @Get('/:name')
    getByName(@Param('name') name: string) {
        return this.roleService.getRoleByName(name);
    }
}
