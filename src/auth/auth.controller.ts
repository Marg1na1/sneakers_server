import {
    BadRequestException,
    Body,
    Controller,
    Get,
    HttpStatus,
    Post,
    Query,
    Req,
    Res,
    UnauthorizedException,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { LoginDto } from './dto';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { Tokens } from './interfaces';
import { Cookies, Public } from '@shared/decorators';
import { UserAgent } from '@shared/decorators/user-agent.decorator';
import { HttpService } from '@nestjs/axios';
import { map, mergeMap } from 'rxjs';
import { handleTimeoutAndErrors } from '@shared/helpers';
import { FileInterceptor } from '@nestjs/platform-express';
import { Providers } from '@enum'
import { GoogleGuard } from './guards/google.guard'
import { CreateUserWithPassDto } from '@user/dto'

const REFRESH_TOKEN = 'refershtoken';

@Public()
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService,
        private readonly httpService: HttpService
    ) {}

    @Post('/register')
    @UseInterceptors(FileInterceptor('image'))
    async register(
        @Body() dto: CreateUserWithPassDto,
        @UserAgent() agent: string,
        @Res() res: Response,
        @UploadedFile() file: Express.Multer.File
    ) {
        const tokens = await this.authService.registration(dto, agent, file);
        if (!tokens) {
            throw new BadRequestException('failed to register user');
        }
        this.setRefreshTokenToCookie(tokens, res);
    }

    @Post('/login')
    async login(
        @Body() dto: LoginDto,
        @Res() res: Response,
        @UserAgent() agent: string
    ) {
        const tokens = await this.authService.login(dto, agent);
        if (!tokens) {
            throw new BadRequestException('login attempt failed');
        }
        this.setRefreshTokenToCookie(tokens, res);
    }

    @Post('/logout')
    async logout(@Res() res: Response) {
        res.clearCookie('refershtoken');
    }

    @Get('/refresh')
    async refreshTokens(
        @Cookies(REFRESH_TOKEN) refreshToken: string,
        @Res() res: Response,
        @UserAgent() agent: string
    ) {
        if (!refreshToken) {
            throw new UnauthorizedException();
        }
        const tokens = await this.authService.refreshTokens(
            refreshToken,
            agent
        );
        if (!tokens) {
            throw new BadRequestException('failed to generate tokens');
        }
        this.setRefreshTokenToCookie(tokens, res);
    }

    private setRefreshTokenToCookie(tokens: Tokens, res: Response) {
        if (!tokens) {
            throw new UnauthorizedException();
        }

        res.cookie(REFRESH_TOKEN, tokens.refreshToken.token, {
            httpOnly: true,
            sameSite: 'lax',
            expires: tokens.refreshToken.exp,
            secure: this.configService.get('NODE_ENV', 'dev') === 'prod',
            path: '/',
        });

        res.status(HttpStatus.CREATED).json(tokens.accessToken);
    }

    @UseGuards(GoogleGuard)
    @Get('google')
    async googleAuth() {}

    @UseGuards(GoogleGuard)
    @Get('google/callback')
    async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
        const token = req.user!['accessToken'];
        return res.redirect(
            `http://localhost:8080/auth/google/success?token=${token}`
        );
    }

    @Get('google/success')
    async success(
        @Query('token') token: string,
        @UserAgent() agent: string,
        @Res() res: Response
    ) {
        return this.httpService
            .get(
                `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`
            )
            .pipe(
                mergeMap(({ data: { email } }) =>
                    this.authService.providerAuth(
                        email,
                        agent,
                        Providers.GOOGLE
                    )
                ),
                map((data) => this.setRefreshTokenToCookie(data, res)),
                handleTimeoutAndErrors()
            );
    }
}
