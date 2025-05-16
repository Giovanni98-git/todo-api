import { IsNotEmpty, IsEmail, MinLength} from "class-validator";
export class ResetPasswordConfirmationDto {
    @IsEmail()
    readonly email: string;
    @IsNotEmpty()
    @MinLength(8)  
    readonly password: string;
    @IsNotEmpty()
    readonly code: string;
}
