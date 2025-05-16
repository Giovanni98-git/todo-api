import { Injectable } from '@nestjs/common';
import * as nodemailer from "nodemailer";

@Injectable()
export class MailerService {
    private async transporter(){
        const testAccount = await nodemailer.createTestAccount();
        const transporter = nodemailer.createTransport({
            host: process.env.MAILHOG_HOST,
            port: 1025,
            ignoreTLS: true,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass
            }
        })
        return transporter;
    }

    async sendSignupConfirmation(email: string) {
        (await this.transporter()).sendMail({
            from: "todo@localhost.com",
            to: email,
            subject: "Inscription",
            html: "<h3>Confirmation of inscription</h3>"  
        })   
    }

    async sendResetPasswordConfirmation( email: string, url: string, code: string) {
        (await this.transporter()).sendMail({
            from: "todo@localhost.com",
            to: email,
            subject: "Reset password",
            html: `<a href="${url}">Reset password</a>
            <p>Secret code : <strong>${code}</strong></p>
            <p>Code will in 15 minutes</p>`  
        })  
    }
}


