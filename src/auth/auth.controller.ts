import { Body, Controller, Delete, Post, Req, UseGuards} from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { AuthService } from './auth.service';
import { ResetPasswordDemandDto } from './dto/resetPasswordDemand.dto';
import { ResetPasswordConfirmationDto } from './dto/resetPasswordConfirmation.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { DeleteAccountDto } from './dto/deleteAccount.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('signup')
    signup(@Body() signupDto: SignupDto) {
        return this.authService.signup(signupDto);
    }
    @Post('signin')
    signin(@Body() signinDto: SigninDto) {
        return this.authService.signin(signinDto);
    }
    @ApiBearerAuth()
    @Post("reset-password")
    ResetPasswordDemand(@Body() resetPasswordDto: ResetPasswordDemandDto) {
        return this.authService.resetPasswordDemand(resetPasswordDto);
    }
    @ApiBearerAuth()
    @Post("reset-password-confirmation")
    resetPasswordConfirmation(@Body() resetPasswordConfirmationDto: ResetPasswordConfirmationDto) {
        return this.authService.resetPasswordConfirmation(resetPasswordConfirmationDto);
    }
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Delete('delete')
    deleteAccount(@Req() request: Request, @Body() deleteAccountDto: DeleteAccountDto){
        const userId = request.user && request.user['id'];
        return this.authService.deleteAccount(userId, deleteAccountDto);
    }

}
