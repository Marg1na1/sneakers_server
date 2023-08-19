import { IsPasswordsMatching } from '@shared/decorators';
import { IsEmail, IsString, MinLength, Validate } from 'class-validator';
import { Roles } from 'src/roles/models/roles.model';
export class CreateUserWithPassDto {
    @IsEmail()
    readonly email: string;

    @IsString()
    @MinLength(8)
    readonly password: string;

    @IsString()
    @MinLength(8)
    @Validate(IsPasswordsMatching)
    readonly passwordRepeat: string;

    readonly userName?: string;

    readonly avatar?: string;

    readonly role: string;
}
