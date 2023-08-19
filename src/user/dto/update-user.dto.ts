export class UpdateUserDto {
    readonly updatedEmail?: string;
    readonly updatedPassword?: string;
    readonly updatedUserName?: string;
    readonly updatedAvatar?: string;
    readonly password: string;
}
