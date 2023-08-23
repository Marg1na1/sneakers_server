import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { options } from './auth.config';
import { STRATEGIES } from './strategies';
import { GUARDS } from './guards';
import { HttpModule } from '@nestjs/axios';
import { UserModule } from '@user/user.module'
import { User } from '@user/models'
import { Token } from './models'
import { MailModule } from '@mail/mail.module'
import { FilesModule } from '@files/files.module'

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
