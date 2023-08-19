import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { MailModule } from 'src/mail/mail.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/user/user.model';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { options } from './auth.config';
import { Token } from './models/token.model';
import { STRATEGIES } from './strategies';
import { GUARDS } from './guards';
import { HttpModule } from '@nestjs/axios';
import { FilesModule } from 'src/files/files.module';

@Module({
    controllers: [AuthController],
    providers: [AuthService, ...STRATEGIES, ...GUARDS],
    imports: [
        forwardRef(() => UserModule),
        PassportModule,
        JwtModule.registerAsync(options()),
        SequelizeModule.forFeature([User, Token]),
        MailModule,
        HttpModule,
        FilesModule,
    ],
    exports: [AuthService, JwtModule],
})
export class AuthModule {}
