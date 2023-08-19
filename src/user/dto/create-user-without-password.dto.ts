import { IsPasswordsMatching } from '@shared/decorators';
import { IsEmail, IsString, MinLength, Validate } from 'class-validator';
import { Roles } from 'src/roles/models/roles.model';
export class CreateUserWithoutPassDto {
    @IsEmail()
    readonly email: string;

    readonly provider: string;

    readonly userName?: string;

    readonly avatar?: string;

}
