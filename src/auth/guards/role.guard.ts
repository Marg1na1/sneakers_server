import { JwtService } from '@nestjs/jwt';
import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '@shared/decorators';

@Injectable()
export class RolesAuthGuard implements CanActivate {
    constructor(private jwtService: JwtService, private reflector: Reflector) {}
    canActivate(
        context: ExecutionContext
    ): boolean | Promise<boolean> | Observable<boolean> {
        try {
            const requiredRoles = this.reflector.getAllAndOverride<string[]>(
                ROLES_KEY,
                [context.getHandler(), context.getClass()]
            );
            if (!requiredRoles) {
                return true;
            }
            //TODO вот эту срань переделать т.к не надо тут мапы
            //возможно сюда запилить проверку на забаненного пользователя
            const requiredRolesMap = {};

            requiredRoles.forEach((role) => (requiredRolesMap[role] = true));

            const req = context.switchToHttp().getRequest();
            const authHeader = req.headers.authorization;
            const barer = authHeader.split(' ')[0];
            const token = authHeader.split(' ')[1];
            if (barer !== 'Bearer' || !token) {
                throw new UnauthorizedException();
            }

            const user = this.jwtService.verify(token); 
            req.user = user;
            for (let role of user.roles) {
                if (requiredRolesMap[role]) return true;
            }
            return false;
        } catch (e) {
            throw new ForbiddenException();
        }
    }
}
