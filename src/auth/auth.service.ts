import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import * as bcrypt from "bcrypt";
import * as speakeasy from "speakeasy"
import { PrismaService } from 'src/prisma/prisma.service';
import { MailerService } from 'src/mailer/mailer.service';
import { SigninDto } from './dto/signin.dto';
import { JwtService } from '@nestjs/jwt';
import { ResetPasswordDemandDto } from './dto/resetPasswordDemand.dto';
import { ResetPasswordConfirmationDto } from './dto/resetPasswordConfirmation.dto';
import { DeleteAccountDto } from './dto/deleteAccount.dto';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, 
        private readonly mailerService: MailerService,
        private readonly jwtService: JwtService,
    ) {}

    async signup(signupDto: SignupDto) {
        const { firstName, lastName, email, password } = signupDto;
        
        const userExists = await this.prisma.user.findUnique({
            where: { email: email },
        });
        if (userExists) {
            throw new ConflictException('User already exists');
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = await this.prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                password: hashedPassword,
            },
        });
        
        await this.mailerService.sendSignupConfirmation(email);
        if (user) {
            return {
                message : "User created successfully"
            }
        }

        throw new Error('Method not implemented.');
    }

    async signin(signin: SigninDto) {
        const { email, password} = signin
        
        const user = await this.prisma.user.findUnique({ where: {email}})
        if (!user) {
            throw new NotFoundException('User not found')
        }
        
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            throw new UnauthorizedException('Password does not match')
        }
        const payload = { email: user.email, sub: user.id }

        const token = this.jwtService.sign(payload, {expiresIn : "2h", secret: process.env.SECRET_KEY})

        return {
            token, user : {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email 
            }
        }
    }

    async resetPasswordDemand(resetPasswordDto: ResetPasswordDemandDto) {
        const { email } = resetPasswordDto;
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        const code = speakeasy.totp( {
            secret: process.env.OTP_CODE as string, 
            digits: 5,
            step: 60 * 15,
            encoding: 'base32'
        })
        const url = process.env.BASE_URL + "/auth/reset-password-confirmation";
        await this.mailerService.sendResetPasswordConfirmation(email, url, code);
        return { data: "Reset password mail has been sent" }
    }

    async resetPasswordConfirmation(resetPasswordConfirmationDto: ResetPasswordConfirmationDto) {
        const { email ,code, password } = resetPasswordConfirmationDto;
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) throw new NotFoundException('User not found');
        const isCodeValid = speakeasy.totp.verify({
            secret: process.env.OTP_CODE as string,
            token: code,
            digits: 5,
            step: 60 * 15,
            encoding: 'base32'
        })
        if (!isCodeValid) throw new UnauthorizedException('Invalid code or expired code');
        const hashedPassword = await bcrypt.hash(password, 10);
        await this.prisma.user.update({
            where: { email },
            data: { password: hashedPassword }
        })
        return { data: "Password reset successfully" }
    }

    async deleteAccount(userId: number, deleteAccountDto: DeleteAccountDto) {
        const { password } = deleteAccountDto;
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new NotFoundException('User not found');
        const match = await bcrypt.compare(password, user.password);
        if (!match) throw new UnauthorizedException('Invalid password');
        await this.prisma.user.delete({ where: { id: userId } });
        return { data: "Account deleted successfully" }
    } 
}