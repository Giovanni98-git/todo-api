import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';

type Payload = {
    sub: number;
    email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor( ConfigService: ConfigService, private readonly prisma: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: ConfigService.get('SECRET_KEY') as string,
            ignoreExpiration: true
        })
    }
    async validate(payload: Payload) {
        const user = await this.prisma.user.findUnique({ where: { email: payload.email} })
        if (!user) throw new UnauthorizedException('User not found');
        Reflect.deleteProperty(user, 'password');
        return user;
    }
}
