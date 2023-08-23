import { Providers } from '@enum'
import { IsEmail } from 'class-validator';

export class CreateUserWithoutPassDto {
    @IsEmail()
    readonly email: string;

    readonly provider: Providers;

    readonly userName?: string;

    readonly avatar?: string;
}
