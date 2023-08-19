import { Providers } from './../user/interfaces';
import {
    BadRequestException,
    ConflictException,
    Injectable,
    Logger,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { MailService } from 'src/mail/mail.service';
import { User } from 'src/user/user.model';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto';
import { compareSync } from 'bcrypt';
import { v4 } from 'uuid';
import { add } from 'date-fns';
import { Token } from './interfaces';
import { Token as TokenModel } from './models/token.model';
import { CreateUserWithPassDto } from 'src/user/dto';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);
    constructor(
        @InjectModel(User) private userRepository: typeof User,
        @InjectModel(TokenModel) private tokenRepository: typeof TokenModel,
        private readonly fileService: FilesService,
        private readonly userService: UserService,
        private readonly mailService: MailService,
        private readonly jwtService: JwtService
    ) {}

    async refreshTokens(refreshToken: string, agent: string) {
        const token = await this.tokenRepository.findByPk(refreshToken);

        if (!token) {
            throw new UnauthorizedException('no tokens');
        }

        await this.tokenRepository.destroy({ where: { id: token.id } });

        if (new Date(token.exp) < new Date()) {
            throw new UnauthorizedException();
        }

        const user = await this.userService.getOneUser(token.userId, true);

        if (!user) {
            throw new NotFoundException();
        }

        const tokens = await this.generateTokens(user, agent);

        await this.tokenRepository.create(tokens.refreshToken);

        return tokens;
    }

    async registration(
        dto: CreateUserWithPassDto,
        agent: string,
        file: Express.Multer.File
    ) {
        const userExist = await this.userService.getOneUser(dto.email);

        if (userExist) {
            throw new ConflictException('user with this email already exists');
        }
        // await this.fileService.create(file);

        const user = await this.userService.createUser(dto);

        const tokens = this.generateTokens(user, agent);

        await this.tokenRepository.create(tokens.refreshToken);

        return tokens;
    }

    async login(dto: LoginDto, agent: string) {
        const user = await this.userService.getOneUser(dto.email, true);

        if (!user || !compareSync(dto.password, user.password)) {
            throw new UnauthorizedException('not correct email or password');
        }

        const token = await this.tokenRepository.findOne({
            where: {
                agent: agent,
                userId: user.id,
            },
        });

        if (token) {
            const tokens = await this.refreshTokens(token.token, agent);

            return tokens;
        } else {
            const tokens = await this.generateTokens(user, agent);

            await this.tokenRepository.create(tokens.refreshToken);

            return tokens;
        }
    }

    async deleteRefreshToken(token: string) {
        await this.tokenRepository.destroy({ where: { token } });
    }

    async providerAuth(email: string, agent: string, provider: Providers) {
        const userExist = await this.userService.getOneUser(email);
        if (userExist) {
            await userExist.update({
                provider,
            });
            const tokens = await this.tokenRepository.findOne({
                where: {
                    userId: userExist.id,
                    agent: agent,
                },
            });
            if (tokens) {
                return await this.refreshTokens(tokens.token, agent);
            } else {
                const tokens = this.generateTokens(userExist, agent);
                await this.tokenRepository.create(tokens.refreshToken);
                return tokens;
            }
        }

        const user = await this.userService.createUser({
            email,
            provider: provider,
        });

        if (!user) {
            throw new BadRequestException('failed to create user');
        }
        console.log(user.roles);

        const tokens = this.generateTokens(user, agent);
        console.log(user);

        await this.tokenRepository.create(tokens.refreshToken);

        return tokens;
    }

    private generateTokens(user: User, agent: string) {
        const payload = {
            id: user.id,
            email: user.email,
            roles: user.roles.map((obj) => obj.roleName),
        };

        const accessToken: string =
            'Bearer ' +
            this.jwtService.sign(payload, {
                expiresIn: process.env.JWT_EXP,
            });

        const refreshToken: Token = {
            token: v4(),
            exp: add(new Date(), { months: 1 }),
            userId: user.id,
            agent,
        };

        return { accessToken, refreshToken };
    }
}
