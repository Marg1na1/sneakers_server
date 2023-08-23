import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Put,
    UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CurrentUser, Roles } from '@shared/decorators';
import { JwtPayload } from '@auth/interfaces'
import { RolesAuthGuard } from '@auth/guards'
import { AddRoleDto, BanUserDto, UpdateUserDto } from './dto'

@Controller('user')
export class UserController {
    constructor(private UserService: UserService) {}
    @Delete('/:id')
    delete(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
        return this.UserService.deleteUser(id, user);
    }
    //TODO сделать так чтобы пользователь мог получать себя, а админ кого угодно
    @Get('/:idOrEmail')
    getOne(
        @Param('idOrEmail') idOrEmail: string,
        @CurrentUser() user: JwtPayload
    ) {
        console.log(user);
        return this.UserService.getOneUser(idOrEmail);
    }

    @Roles('ADMIN')
    @UseGuards(RolesAuthGuard)
    @Get()
    getAll() {
        return this.UserService.getAllUsers();
    }

    @Roles('ADMIN')
    @UseGuards(RolesAuthGuard)
    @Patch('/role')
    addRole(@Body() dto: AddRoleDto) {
        return this.UserService.addUserRole(dto);
    }

    @Roles('ADMIN')
    @UseGuards(RolesAuthGuard)
    @Patch('/ban')
    ban(@Body() dto: BanUserDto) {
        return this.UserService.banUser(dto);
    }

    @Roles('ADMIN')
    @UseGuards(RolesAuthGuard)
    @Patch('/unban/:id')
    unBan(@Param('id') id: string) {
        return this.UserService.unBanUser(id);
    }

    @Put('/:id')
    updateUser(
        @Body() dto: UpdateUserDto,
        @Param('id') id: string,
        @CurrentUser() user: JwtPayload
    ) {
        return this.UserService.updateUser(dto, id, user.id);
    }
}
