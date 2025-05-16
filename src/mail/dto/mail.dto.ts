import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class MailDto {
  @IsNotEmpty()
  @IsOptional()
  readonly title?: string;
  @IsNotEmpty()
  readonly message: string;
  @IsNotEmpty()
  @IsEmail()
  readonly emailTo: string;
  @IsEmail()
  @IsOptional()
  readonly emailsCC?: string;
  @IsEmail()
  @IsOptional()
  readonly emailCci?: string;
}
