import { IsNotEmpty, IsEmail, MinLength } from 'class-validator';
export class SigninDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
  @IsNotEmpty()
  @MinLength(8)
  readonly password: string;
}
