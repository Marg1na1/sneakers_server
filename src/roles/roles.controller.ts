import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { Roles } from '@shared/decorators';
import { CreteRolesDto } from './dto'
import { RolesAuthGuard } from '@auth/guards'

@Controller('roles')
export class RolesController {
    constructor(private roleService: RolesService) {}

    @Roles('ADMIN')
    @UseGuards(RolesAuthGuard)
    @Post()
    create(@Body() dto: CreteRolesDto) {
        return this.roleService.createRole(dto);
    }

    @Get('/:name')
    getByName(@Param('name') name: string) {
        return this.roleService.getRoleByName(name);
    }
}
