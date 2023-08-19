import {
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import { CreateUserWithPassDto } from 'src/user/dto';

@ValidatorConstraint({ name: 'IsPasswordsMatching', async: false })
export class IsPasswordsMatching implements ValidatorConstraintInterface {
    validate(passwordRepeat: string, args: ValidationArguments) {
        const obj = args.object as CreateUserWithPassDto;
        return obj.password === passwordRepeat;
    }

    defaultMessage(validationArguments?: ValidationArguments): string {
        return "passwords don't match";
    }
}
