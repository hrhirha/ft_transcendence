import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from 'src/user/dto';
import { HOST } from 'src/utils';

@Injectable()
export class AuthService {

    constructor(
        private _configS: ConfigService,
        private _jwtS: JwtService,
        private _prismaS: PrismaService,
    ){}

    async login(dto: UserDto, req: Request)
    {
        const user = await this._prismaS.user.upsert({
            where: {username: dto.username, },
            update: {},
            create: {
                ...dto,
                rank: {connect: {title: 'Wood'}}
            },
            select: {
                id: true,
                username: true,
                fullName: true,
                email: true,
                imageUrl: true,
                isTfaEnabled: true,
                score: true,
                rank: true,
                wins: true,
                loses: true,
                status: true,
            }
        });

        let referer = req.header("Referer") || `http://${HOST}:3000`;
        if (user.isTfaEnabled)
            referer += "checkpoint";

        const cookie = this.getCookieWithJwtAccessToken(user.id);
        req.res.setHeader('Set-Cookie', cookie)
            .setHeader('Location', referer)
            .status(HttpStatus.PERMANENT_REDIRECT);
        return user;
    }

    getCookieWithJwtAccessToken(id: string, is2fauthenticated = false) {
        const payload = { sub: id, is2fauthenticated };

        const secret = this._configS.get('JWT_ACCESS_SECRET');
        const exp_time = this._configS.get('JWT_ACCESS_EXP');
        const options = { secret, expiresIn: exp_time };

        const access_token = this._jwtS.sign(payload, options);

        return `access_token=${access_token}; Path=/; Max-Age=${exp_time}; HttpOnly; SameSite=Lax`;
    }

    async getUserFromToken(token: string)
    {
        let payload: any;
        try
        {
            payload = this._jwtS.verify(token, {
                secret: this._configS.get('JWT_ACCESS_SECRET'),
            });
            if (payload.sub) {
                const user = await this._prismaS.user.findUnique({
                    where: { id: payload.sub, },
                });
                return user;
            }
        }
        catch
        {
            return null;
        }
    }   
}
