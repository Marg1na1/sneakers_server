import {
    ConflictException,
    ForbiddenException,
    Inject,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { BanUserDto } from './dto/ban-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesService } from 'src/roles/roles.service';
import { AddRoleDto } from './dto/add-role.dto';
import { compareSync, genSaltSync, hashSync } from 'bcrypt';
import { JwtPayload } from 'src/auth/interfaces';
import { UserRoles } from 'src/roles/models/user-roles.model';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { convertToSecondsUtil } from '@shared/utils';
import { Op } from 'sequelize';
import { v4 } from 'uuid';
import { CreateUserWithPassDto, CreateUserWithoutPassDto } from './dto';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User) private userRepository: typeof User,
        @InjectModel(UserRoles) private userRolesRepository: typeof UserRoles,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private rolesService: RolesService
    ) {}

    async createUser(dto: CreateUserWithPassDto | CreateUserWithoutPassDto) {
        if ('provider' in dto) {
            return this.createUserWithoutPassword(dto);
        } else {
            return this.createUserWithPassword(dto);
        }
    }

    async deleteUser(id: string, user: JwtPayload) {
        const currentRole = await this.userRolesRepository.findOne({
            where: { userId: user.id, roleId: 2 },
        });
        if (+user.id !== +id && !currentRole) {
            throw new ForbiddenException();
        }
        //удаляем из кеша по id и по email
        await Promise.all([
            this.cacheManager.del(id),
            this.cacheManager.del(user.email),
        ]);

        const deleted = await this.userRepository.destroy({
            where: { id },
        });

        return deleted;
    }

    async getOneUser(search: string, isReset = false) {
        if (isReset) {
            await this.cacheManager.del(search);
        }
        const user = await this.cacheManager.get<User>(search);
        if (!user) {
            const user = await this.userRepository.findOne({
                where: {
                    [Op.or]: [
                        { id: search },
                        { email: search },
                        { userName: search },
                    ],
                },
                include: ['roles', 'cart'],
            });
            if (!user) {
                return null;
            }
            await this.cacheManager.set(
                search,
                user,
                convertToSecondsUtil(process.env.JWT_EXP || '1d')
            );
            return user;
        }
        return user;
    }

    async getAllUsers() {
        const users = await this.userRepository.findAll({
            include: { all: true },
        });
        return users;
    }

    async addUserRole(dto: AddRoleDto) {
        const user = await this.getOneUser(dto.userId);
        const role = await this.rolesService.getRoleByName(dto.roleName);
        if (!user) throw new NotFoundException('user is not found');
        if (!role) throw new NotFoundException('role is not found');
        await user.$add('role', role.id);
        return dto;
    }

    async banUser(dto: BanUserDto) {
        const user = await this.getOneUser(dto.userId);
        if (user) {
            if (!user.banned) {
                user.banReason = dto.banReason;
                user.banned = true;
                await user.save();
                return dto;
            }
            throw new ConflictException('user already banned');
        }
        throw new NotFoundException('user is not found');
    }

    async unBanUser(id: string) {
        const user = await this.getOneUser(id);
        if (user) {
            if (user.banned) {
                user.banned = false;
                await user.save();
                return user;
            }
            throw new ConflictException('the user has not been banned');
        }
        throw new NotFoundException('user is not found');
    }

    async updateUser(dto: UpdateUserDto, id: string, curUser: JwtPayload) {
        const currentRole = await this.userRolesRepository.findOne({
            where: { userId: curUser.id, roleId: 2 },
        });

        if (curUser.id !== id && !currentRole) {
            throw new UnauthorizedException();
        }

        const user = await this.getOneUser(id);
        if (user) {
            if (compareSync(dto.password!, user.password)) {
                user.update({
                    avatar: dto.updatedAvatar || user.avatar,
                    email: dto.updatedEmail || user.email,
                    password: dto.updatedPassword || user.password,
                    userName: dto.updatedUserName || user.userName,
                });
                await user.save();
                return user;
            }
            throw new UnauthorizedException();
        }
        throw new NotFoundException('user is not found');
    }

    private hashPassword(password: string) {
        return hashSync(password, genSaltSync(5));
    }

    private async createUserWithPassword(dto: CreateUserWithPassDto) {
        const hashPassword = this.hashPassword(dto.password);
        const user = await this.userRepository.create({
            email: dto.email,
            password: hashPassword,
            userName: dto.userName || 'user ' + v4(),
            //TODO сделать обрабоку и генерацию ника и аватара
        });

        const role = await this.rolesService.getRoleByName(dto.role || 'USER');
        if (!role) {
            throw new NotFoundException();
        }
        await user.$set('roles', [role.id]);
        user.roles = [role];
        await this.cacheManager.set(user.id, user);
        await this.cacheManager.set(user.email, user);
        return user;
    }

    private async createUserWithoutPassword(dto: CreateUserWithoutPassDto) {
        const user = await this.userRepository.create({
            email: dto.email,
            userName: dto.userName || 'user ' + v4(),
            //TODO сделать обрабоку и генерацию ника и аватара
        });

        const role = await this.rolesService.getRoleByName('USER');
        if (!role) {
            throw new NotFoundException();
        }
        await user.$set('roles', [role.id]);
        user.roles = [role];
        await this.cacheManager.set(user.id, user);
        await this.cacheManager.set(user.email, user);
        return user;
    }
}
