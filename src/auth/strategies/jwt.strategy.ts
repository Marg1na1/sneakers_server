import { UserService } from './../../user/user.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly userService: UserService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.PRIVATE_KEY,
        });
    }

    async validate(payload: JwtPayload) {
        const user = await this.userService.getOneUser(payload.id);
        if (!user) {
            throw new UnauthorizedException();
        }
        // else if (!user.banned) {
        //     throw new UnauthorizedException('this user is banned');
        // }
        return payload;
    }
}
